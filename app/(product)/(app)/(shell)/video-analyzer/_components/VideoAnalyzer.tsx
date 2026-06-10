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
  ShieldCheck,
  X,
} from "lucide-react";
import { AiGenerating } from "@/app/(product)/_components/AiGenerating";
import { useInvalidateUsage } from "@/lib/web/ai/usage";
import { showAiError } from "@/lib/web/ai/useAiMutation";
import {
  completeGcsUpload,
  createAnalysisDraft,
  getSignedUploadUrl,
  isUploadAborted,
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

type Phase = "idle" | "uploading" | "preparing" | "analysis";

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

/**
 * Orchestrates the full Video Analyzer flow:
 * idle → uploading (GCS PUT with progress) → preparing (gcs-complete + draft)
 * → analysis (poll until COMPLETED/FAILED, then results).
 */
export function VideoAnalyzer() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const invalidateUsage = useInvalidateUsage();

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [parentAnalysisId, setParentAnalysisId] = useState<string | null>(
    () => searchParams.get("revisionOf"),
  );

  const abortRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);

  const startAnalysis = async (file: File) => {
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

      // 2. Raw PUT to Google Cloud Storage with real progress.
      await uploadToGcs(signed.resumableUrl, file, {
        contentType,
        signal: controller.signal,
        onProgress: (percent) => {
          if (runIdRef.current === runId) setProgress(percent);
        },
      });
      if (runIdRef.current !== runId) return;
      setPhase("preparing");

      // 3. Confirm the upload with the Afia API.
      const completed = await completeGcsUpload({
        storagePath: signed.storagePath,
        fileName: file.name,
        fileSize: file.size,
        creatorId: user.id,
      });
      if (runIdRef.current !== runId) return;

      // 4. Create the analysis draft (server charges credits).
      const draft = await createAnalysisDraft({
        uploadId: completed.uploadId,
        parentAnalysisId: parentAnalysisId ?? undefined,
      });
      invalidateUsage();
      if (runIdRef.current !== runId) return;

      setAnalysisId(draft.analysisId);
      setPhase("analysis");
    } catch (error) {
      if (runIdRef.current !== runId) return;
      if (!isUploadAborted(error)) showAiError(error);
      setPhase("idle");
      setProgress(0);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
  };

  const resetFlow = (nextParentId: string | null) => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setParentAnalysisId(nextParentId);
    setAnalysisId(null);
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

      {phase === "idle" && parentAnalysisId && (
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
                Your next upload will be compared with your{" "}
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
        <UploadCard onFileSelected={(file) => void startAnalysis(file)} />
      )}

      {phase === "uploading" && fileName && (
        <UploadProgress
          fileName={fileName}
          fileSize={fileSize}
          progress={progress}
          onCancel={cancelUpload}
        />
      )}

      {phase === "preparing" && (
        <AiGenerating
          label="Preparing your video…"
          sublabel="Finalizing the upload and queuing the analysis."
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
