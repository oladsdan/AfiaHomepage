import { aiFetch } from "./client";
import type {
  AnalysisDraftResult,
  AnalysisHistoryEntry,
  GcsCompleteResult,
  GcsSignedUrl,
  VideoAnalysis,
} from "./types";

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

/**
 * PUTs the raw file to the GCS resumable URL using XMLHttpRequest so real
 * upload progress is available. No Authorization header, no credentials —
 * this request goes to Google Cloud Storage, not the Afia API.
 */
export function uploadToGcs(
  url: string,
  file: File,
  options: UploadToGcsOptions = {},
): Promise<void> {
  const { contentType, onProgress, signal } = options;

  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new UploadAbortedError());
      return;
    }

    const xhr = new XMLHttpRequest();
    let settled = false;

    const onAbortSignal = () => {
      xhr.abort();
    };
    const cleanup = () => {
      signal?.removeEventListener("abort", onAbortSignal);
    };

    xhr.open("PUT", url, true);
    xhr.setRequestHeader(
      "Content-Type",
      contentType || file.type || "video/mp4",
    );

    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable && onProgress) {
        onProgress(
          Math.min(100, Math.round((event.loaded / event.total) * 100)),
        );
      }
    };

    xhr.onload = () => {
      if (settled) return;
      settled = true;
      cleanup();
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        reject(
          new Error(
            `Video upload failed (HTTP ${xhr.status}). Please try again.`,
          ),
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
    xhr.send(file);
  });
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
    { method: "POST", body: input },
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
