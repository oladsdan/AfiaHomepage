import { getApiBaseUrl } from "@/lib/web/api";
import { aiFetch } from "./client";
import type {
  AnalysisDraftResult,
  AnalysisHistoryEntry,
  AnalysisStatus,
  GcsCompleteResult,
  GcsSignedUrl,
  VideoAnalysis,
} from "./types";

/** Resolve a possibly-relative media URL (thumbnail/frame) to an absolute one. */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (typeof url !== "string" || !url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${getApiBaseUrl()}${url.charAt(0) === "/" ? "" : "/"}${url}`;
}

/** Normalized status: prefers analysisStatus, falls back to status. */
export function statusOf(analysis: Pick<VideoAnalysis, "analysisStatus" | "status">): AnalysisStatus {
  return (analysis.analysisStatus || analysis.status || "PENDING") as AnalysisStatus;
}

export function isTerminalStatus(status: AnalysisStatus | undefined): boolean {
  return status === "COMPLETED" || status === "FAILED";
}

/**
 * Video Analyzer API (02-ai-tools.md, Prompt 7).
 *
 * Upload flow (multi-step, asynchronous):
 *  1. POST /api/videos/gcs-signed-url   → resumable upload URL (usage gate!)
 *  2. PUT raw file to that URL          → Google Cloud Storage (XHR, no auth)
 *  3. POST /api/videos/gcs-complete     → uploadId
 *  4. POST /api/videos/analyze/draft    → analysisId (charges credits)
 *  5. GET  /api/videos/analysis/:id     → poll until status !== "PENDING"
 */

interface Envelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

// ---------------------------------------------------------------------------
// Step 1 — signed upload URL (this call is also the usage/credit check)
// ---------------------------------------------------------------------------

export interface SignedUrlInput {
  creatorId: string;
  fileName: string;
  contentType: string;
}

export async function getSignedUploadUrl(
  input: SignedUrlInput,
): Promise<GcsSignedUrl> {
  const body = await aiFetch<Envelope<GcsSignedUrl>>(
    "/api/videos/gcs-signed-url",
    { method: "POST", body: input },
  );
  return body.data as GcsSignedUrl;
}

// ---------------------------------------------------------------------------
// Step 2 — raw PUT to Google Cloud Storage (NOT the Afia API)
// ---------------------------------------------------------------------------

/** Thrown when the caller aborts an in-flight GCS upload. */
export class UploadAbortedError extends Error {
  constructor() {
    super("Upload cancelled");
    this.name = "UploadAbortedError";
  }
}

export function isUploadAborted(error: unknown): boolean {
  return error instanceof UploadAbortedError;
}

export interface UploadToGcsOptions {
  contentType?: string;
  /** Receives whole-number percent values 0–100. */
  onProgress?: (percent: number) => void;
  /** Abort the upload via an AbortController signal. */
  signal?: AbortSignal;
}

/** 8 MB chunks — matches the mobile client's resumable upload. */
const GCS_CHUNK_SIZE = 8 * 1024 * 1024;

/** PUT one chunk via XHR so we get sub-chunk progress; resolves the HTTP status. */
function putChunk(
  url: string,
  chunk: Blob,
  contentRange: string,
  baseUploaded: number,
  totalSize: number,
  onProgress: ((percent: number) => void) | undefined,
  signal: AbortSignal | undefined,
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new UploadAbortedError());
      return;
    }
    const xhr = new XMLHttpRequest();
    let settled = false;
    const onAbortSignal = () => xhr.abort();
    const cleanup = () => signal?.removeEventListener("abort", onAbortSignal);

    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Range", contentRange);

    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable && onProgress && totalSize > 0) {
        const percent = Math.min(
          99,
          Math.round(((baseUploaded + event.loaded) / totalSize) * 100),
        );
        onProgress(percent);
      }
    };
    xhr.onload = () => {
      if (settled) return;
      settled = true;
      cleanup();
      // 308 = resume incomplete (more chunks expected); 200/201 = complete.
      if (xhr.status === 308 || xhr.status === 200 || xhr.status === 201) {
        resolve(xhr.status);
      } else {
        reject(
          new Error(`Video upload failed (HTTP ${xhr.status}). Please try again.`),
        );
      }
    };
    xhr.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(
        new Error("Video upload failed. Check your connection and try again."),
      );
    };
    xhr.onabort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new UploadAbortedError());
    };

    signal?.addEventListener("abort", onAbortSignal);
    xhr.send(chunk);
  });
}

/**
 * Uploads the raw file to the GCS resumable session URL in 8 MB chunks with
 * Content-Range headers (mirrors the mobile client). Goes straight to Google
 * Cloud Storage — no Authorization header, no credentials. Reports smooth
 * 0–100 progress and supports cancellation via an AbortSignal.
 */
export async function uploadToGcs(
  url: string,
  file: File,
  options: UploadToGcsOptions = {},
): Promise<void> {
  const { onProgress, signal } = options;
  const totalSize = file.size;

  if (signal?.aborted) throw new UploadAbortedError();

  // Empty file: a single zero-length finalizing PUT.
  if (totalSize === 0) {
    await putChunk(url, file.slice(0, 0), `bytes */0`, 0, 0, onProgress, signal);
    onProgress?.(100);
    return;
  }

  let uploaded = 0;
  while (uploaded < totalSize) {
    if (signal?.aborted) throw new UploadAbortedError();
    const chunkEnd = Math.min(uploaded + GCS_CHUNK_SIZE, totalSize);
    const chunk = file.slice(uploaded, chunkEnd);
    const contentRange = `bytes ${uploaded}-${chunkEnd - 1}/${totalSize}`;

    const status = await putChunk(
      url,
      chunk,
      contentRange,
      uploaded,
      totalSize,
      onProgress,
      signal,
    );

    if (status === 200 || status === 201) {
      uploaded = totalSize;
      break;
    }
    // 308 — advance past the chunk we just sent.
    uploaded = chunkEnd;
    onProgress?.(Math.min(99, Math.round((uploaded / totalSize) * 100)));
  }

  onProgress?.(100);
}

// ---------------------------------------------------------------------------
// Step 3 — confirm the upload with the Afia API
// ---------------------------------------------------------------------------

export interface GcsCompleteInput {
  storagePath: string;
  fileName: string;
  fileSize: number;
  creatorId: string;
}

export async function completeGcsUpload(
  input: GcsCompleteInput,
): Promise<GcsCompleteResult> {
  const body = await aiFetch<Envelope<GcsCompleteResult>>(
    "/api/videos/gcs-complete",
    {
      method: "POST",
      // The backend expects fileSize as a string (matches the mobile client).
      body: {
        storagePath: input.storagePath,
        fileName: input.fileName,
        fileSize: String(input.fileSize),
        creatorId: input.creatorId,
      },
    },
  );
  return body.data as GcsCompleteResult;
}

// ---------------------------------------------------------------------------
// Step 4 — create the analysis draft (charges credits server-side)
// ---------------------------------------------------------------------------

export interface AnalyzeDraftInput {
  uploadId: string;
  parentAnalysisId?: string;
}

export async function createAnalysisDraft(
  input: AnalyzeDraftInput,
): Promise<AnalysisDraftResult> {
  const payload: AnalyzeDraftInput = { uploadId: input.uploadId };
  if (input.parentAnalysisId) {
    payload.parentAnalysisId = input.parentAnalysisId;
  }
  const body = await aiFetch<Envelope<AnalysisDraftResult>>(
    "/api/videos/analyze/draft",
    { method: "POST", body: payload },
  );
  return body.data as AnalysisDraftResult;
}

// ---------------------------------------------------------------------------
// Step 5 — fetch/poll a single analysis
// ---------------------------------------------------------------------------

export async function getAnalysis(analysisId: string): Promise<VideoAnalysis> {
  const body = await aiFetch<Envelope<VideoAnalysis>>(
    `/api/videos/analysis/${encodeURIComponent(analysisId)}`,
  );
  const data = (body.data ?? (body as unknown)) as VideoAnalysis;
  return { ...data, id: data.id || analysisId };
}

// ---------------------------------------------------------------------------
// History / stats / revisions
// ---------------------------------------------------------------------------

function extractEntryArray(raw: unknown): Record<string, unknown>[] {
  let list: unknown = raw;
  if (!Array.isArray(list)) {
    const record = asRecord(raw);
    if (record) {
      const candidateKeys = [
        "analyses",
        "history",
        "items",
        "videos",
        "results",
        "data",
      ];
      for (let i = 0; i < candidateKeys.length; i += 1) {
        const candidate = record[candidateKeys[i]];
        if (Array.isArray(candidate)) {
          list = candidate;
          break;
        }
      }
    }
  }
  if (!Array.isArray(list)) return [];
  const out: Record<string, unknown>[] = [];
  list.forEach((entry) => {
    const record = asRecord(entry);
    if (record) out.push(record);
  });
  return out;
}

function coerceId(record: Record<string, unknown>): string {
  const candidates = [record.id, record.analysisId, record._id];
  for (let i = 0; i < candidates.length; i += 1) {
    const value = candidates[i];
    if (typeof value === "string" && value) return value;
    if (typeof value === "number") return String(value);
  }
  return "";
}

export async function getVideoHistory(): Promise<AnalysisHistoryEntry[]> {
  const body = await aiFetch<Envelope<unknown>>("/api/videos/history");
  const entries = extractEntryArray(body.data ?? body);
  const out: AnalysisHistoryEntry[] = [];
  entries.forEach((record) => {
    const id = coerceId(record);
    if (id) out.push({ ...record, id } as AnalysisHistoryEntry);
  });
  return out;
}

export interface VideoStats {
  totalAnalyses?: number;
  averageScore?: number;
  [key: string]: unknown;
}

export async function getVideoStats(): Promise<VideoStats> {
  const body = await aiFetch<Envelope<VideoStats>>("/api/videos/stats");
  return (body.data ?? {}) as VideoStats;
}

export async function getAnalysisRevisions(
  analysisId: string,
): Promise<VideoAnalysis[]> {
  const body = await aiFetch<Envelope<unknown>>(
    `/api/videos/analysis/${encodeURIComponent(analysisId)}/revisions`,
  );
  const entries = extractEntryArray(body.data ?? body);
  const out: VideoAnalysis[] = [];
  entries.forEach((record) => {
    const id = coerceId(record);
    if (id) out.push({ ...record, id } as VideoAnalysis);
  });
  return out;
}

// ---------------------------------------------------------------------------
// Follow-up question about an analysis
// ---------------------------------------------------------------------------

export async function askAnalysisFollowup(
  analysisId: string,
  question: string,
): Promise<string> {
  const body = await aiFetch<Envelope<unknown>>(
    `/api/videos/analysis/${encodeURIComponent(analysisId)}/followup`,
    { method: "POST", body: { question } },
  );
  const data = body.data ?? body;
  if (typeof data === "string") return data;
  const record = asRecord(data);
  if (record) {
    const keys = ["reply", "answer", "response", "text", "message"];
    for (let i = 0; i < keys.length; i += 1) {
      const value = record[keys[i]];
      if (typeof value === "string" && value) return value;
    }
  }
  return "";
}

// ---------------------------------------------------------------------------
// Retry a failed/stuck analysis (charges credits server-side)
// ---------------------------------------------------------------------------

export interface RetryResult {
  analysisId?: string;
  status?: string;
  [key: string]: unknown;
}

export async function retryAnalysis(analysisId: string): Promise<RetryResult> {
  const body = await aiFetch<Envelope<RetryResult>>(
    `/api/videos/analysis/${encodeURIComponent(analysisId)}/retry`,
    { method: "POST" },
  );
  return (body.data ?? {}) as RetryResult;
}

// ---------------------------------------------------------------------------
// Delete an analysis
// ---------------------------------------------------------------------------

export async function deleteAnalysis(analysisId: string): Promise<void> {
  await aiFetch(`/api/videos/analysis/${encodeURIComponent(analysisId)}`, {
    method: "DELETE",
  });
}
