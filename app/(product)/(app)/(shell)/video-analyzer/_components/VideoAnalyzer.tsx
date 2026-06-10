"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  FileText,
  FileVideo,
  GitCompareArrows,
  History,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { useInvalidateUsage } from "@/lib/web/ai/usage";
import { showAiError } from "@/lib/web/ai/useAiMutation";
import {
  completeGcsUpload,
  createAnalysisDraft,
  getSignedUploadUrl,
  isUploadAborted,
  resolveMediaUrl,
  uploadToGcs,
} from "@/lib/web/ai/videos-api";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import { toast } from "@/lib/web/toast";
import { analyzerBenefits } from "@/lib/web/video-analyzer-data";
import { Card } from "../../dashboard/_components/ui/Card";
import { IconBadge } from "../../dashboard/_components/ui/IconBadge";
import { AnalysisView } from "./AnalysisView";
import { UploadCard } from "./UploadCard";

const MAX_FILE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB (matches the upload UI)

type Phase = "idle" | "uploading" | "uploaded" | "starting" | "analysis";

interface UploadedVideo {
  uploadId: string;
  fileName: string;
  fileSize: number;
  thumbnailUrl: string | null;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function UploadProgress({
  fileName,
  fileSize,
  progress,
  onCancel,
}: {
  fileName: string;
  fileSize: number;
  progress: number;
  onCancel: () => void;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-brand/10 text-dash-brand">
          <FileVideo className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-dash-ink">
            {fileName}
          </p>
          <p className="mt-0.5 text-xs text-dash-muted">
            Uploading{fileSize > 0 ? ` · ${formatBytes(fileSize)}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-dash-border bg-dash-surface px-3 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Cancel
        </button>
      </div>

      <div className="mt-4">
        <div
          role="progressbar"
          aria-label="Upload progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-dash-bg"
        >
          <div
            className="h-full rounded-full bg-dash-brand transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs font-medium tabular-nums text-dash-muted">
          {progress}%
        </p>
      </div>
    </Card>
  );
}

/** Thumbnail preview + "Analyze my video" — the step the user reviews before paying. */
function UploadedPreview({
  video,
  starting,
  onAnalyze,
  onRemove,
}: {
  video: UploadedVideo;
  starting: boolean;
  onAnalyze: () => void;
  onRemove: () => void;
}) {
  const displayName = video.fileName.replace(/\.[^/.]+$/, "");
  return (
    <Card className="flex flex-col items-center p-5 sm:p-6">
      <div className="relative w-full max-w-[260px] overflow-hidden rounded-dash-lg bg-dash-border shadow-dash-md">
        <button
          type="button"
          onClick={onRemove}
          disabled={starting}
          aria-label="Remove video"
          className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 text-dash-ink shadow-dash transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand disabled:opacity-50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="aspect-[3/4] w-full">
          {video.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnailUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-dash-bg text-dash-muted">
              <Video className="h-12 w-12" aria-hidden="true" />
            </span>
          )}
        </div>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white">
            <Play className="h-6 w-6 translate-x-0.5 fill-current" aria-hidden="true" />
          </span>
        </span>
      </div>

      <p className="mt-4 max-w-full truncate text-center text-base font-semibold text-dash-ink">
        {displayName}
      </p>
      {video.fileSize > 0 && (
        <p className="mt-0.5 text-sm text-dash-muted">{formatBytes(video.fileSize)}</p>
      )}

      <button
        type="button"
        onClick={onAnalyze}
        disabled={starting}
        className="mt-6 inline-flex w-full max-w-[320px] items-center justify-center gap-2 rounded-dash bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-dash-md transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {starting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        )}
        {starting ? "Starting analysis…" : "Analyze my video"}
      </button>
      <button
        type="button"
        onClick={onRemove}
        disabled={starting}
        className="mt-2 rounded text-sm font-medium text-dash-muted transition-colors hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand disabled:opacity-50"
      >
        Choose a different video
      </button>
    </Card>
  );
}

/**
 * Orchestrates the full Video Analyzer flow (mirrors the mobile app):
 * idle → uploading (chunked GCS PUT) → uploaded (thumbnail + "Analyze my
 * video") → starting (analyze/draft) → analysis (poll → results).
 */
export function VideoAnalyzer() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const invalidateUsage = useInvalidateUsage();

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [uploaded, setUploaded] = useState<UploadedVideo | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [parentAnalysisId, setParentAnalysisId] = useState<string | null>(
    () => searchParams.get("revisionOf"),
  );

  const abortRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);

  const uploadFile = async (file: File) => {
    if (!user) {
      toast("Please log in to analyze videos.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast("That video is larger than 2GB. Please upload a smaller file.");
      return;
    }

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    const contentType = file.type || "video/mp4";

    setFileName(file.name);
    setFileSize(file.size);
    setProgress(0);
    setPhase("uploading");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // 1. Signed URL — this is also the server-side usage/credit check.
      const signed = await getSignedUploadUrl({
        creatorId: user.id,
        fileName: file.name,
        contentType,
      });
      if (runIdRef.current !== runId) return;

      // 2. Chunked resumable PUT to Google Cloud Storage with real progress.
      await uploadToGcs(signed.resumableUrl, file, {
        contentType,
        signal: controller.signal,
        onProgress: (percent) => {
          if (runIdRef.current === runId) setProgress(percent);
        },
      });
      if (runIdRef.current !== runId) return;

      // 3. Confirm the upload with the Afia API → uploadId + thumbnail.
      const completed = await completeGcsUpload({
        storagePath: signed.storagePath,
        fileName: file.name,
        fileSize: file.size,
        creatorId: user.id,
      });
      if (runIdRef.current !== runId) return;

      setUploaded({
        uploadId: completed.uploadId,
        fileName: completed.fileName || file.name,
        fileSize: file.size,
        thumbnailUrl: resolveMediaUrl(completed.thumbnailUrl),
      });
      setPhase("uploaded");
    } catch (error) {
      if (runIdRef.current !== runId) return;
      if (!isUploadAborted(error)) showAiError(error);
      setPhase("idle");
      setProgress(0);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const analyzeUploaded = async () => {
    if (!uploaded) return;
    setPhase("starting");
    try {
      const draft = await createAnalysisDraft({
        uploadId: uploaded.uploadId,
        parentAnalysisId: parentAnalysisId ?? undefined,
      });
      invalidateUsage();
      setAnalysisId(draft.analysisId);
      setPhase("analysis");
    } catch (error) {
      showAiError(error);
      setPhase("uploaded");
    }
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
  };

  const removeUploaded = () => {
    setUploaded(null);
    setProgress(0);
    setFileName(null);
    setFileSize(0);
    setPhase("idle");
  };

  const resetFlow = (nextParentId: string | null) => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setParentAnalysisId(nextParentId);
    setAnalysisId(null);
    setUploaded(null);
    setFileName(null);
    setFileSize(0);
    setProgress(0);
    setPhase("idle");
  };

  // ---- Analysis (poll → results / failed / timeout) ------------------------
  if (phase === "analysis" && analysisId) {
    return (
      <AnalysisView
        analysisId={analysisId}
        thumbnailUrl={uploaded?.thumbnailUrl ?? null}
        onAnalyzeRevision={(id) => resetFlow(id)}
        onRetried={(newId) => setAnalysisId(newId)}
        onReset={() => resetFlow(null)}
      />
    );
  }

  return (
    <>
      {phase === "idle" && (
        <div className="flex justify-end gap-2">
          <Link
            href="/recent-videos"
            className="inline-flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
          >
            <History className="h-4 w-4" aria-hidden="true" />
            Past analyses
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Drafts
          </button>
        </div>
      )}

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-dash-ink sm:text-3xl">
          Analyze your video. Grow your content.
        </h1>
        <p className="mt-2 text-sm text-dash-muted">
          Upload a video and get AI-powered insights to improve engagement,
          retention, and performance.
        </p>
      </div>

      {(phase === "idle" || phase === "uploaded") && parentAnalysisId && (
        <Card className="flex flex-col gap-3 border-dash-brand/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-brand/10 text-dash-brand">
              <GitCompareArrows className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-dash-ink">
                Analyzing a revision
              </p>
              <p className="text-xs text-dash-muted">
                Your next analysis will be compared with your{" "}
                <Link
                  href={`/video-analyzer/analysis/${parentAnalysisId}`}
                  className="rounded font-semibold text-dash-brand transition-colors hover:text-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
                >
                  previous analysis
                </Link>
                .
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setParentAnalysisId(null)}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-dash-border bg-dash-surface px-3 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand sm:self-auto"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Cancel revision
          </button>
        </Card>
      )}

      {phase === "idle" && (
        <UploadCard onFileSelected={(file) => void uploadFile(file)} />
      )}

      {phase === "uploading" && fileName && (
        <UploadProgress
          fileName={fileName}
          fileSize={fileSize}
          progress={progress}
          onCancel={cancelUpload}
        />
      )}

      {(phase === "uploaded" || phase === "starting") && uploaded && (
        <UploadedPreview
          video={uploaded}
          starting={phase === "starting"}
          onAnalyze={() => void analyzeUploaded()}
          onRemove={removeUploaded}
        />
      )}

      {phase === "idle" && (
        <>
          <section aria-label="What you'll get" className="space-y-3">
            <h2 className="text-sm font-semibold text-dash-ink">
              What you&apos;ll get
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {analyzerBenefits.map((benefit) => (
                <Card key={benefit.id} className="p-5">
                  <IconBadge icon={benefit.icon} color={benefit.color} />
                  <h3 className="mt-4 text-sm font-semibold text-dash-ink">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-dash-muted">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-brand/10 text-dash-brand">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-dash-ink">
                  Your data is secure
                </p>
                <p className="text-xs text-dash-muted">
                  We never share your videos. All analysis is private and
                  confidential.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1 self-start rounded text-sm font-semibold text-dash-brand transition-colors hover:text-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand sm:self-auto"
            >
              Learn more about privacy
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </Card>
        </>
      )}
    </>
  );
}
