"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  CircleAlert,
  History,
  Hourglass,
  Loader2,
  RotateCcw,
  Upload,
} from "lucide-react";
import { AiGenerating } from "@/app/(product)/_components/AiGenerating";
import { AiError } from "@/lib/web/ai/client";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import { retryAnalysis, type RetryResult } from "@/lib/web/ai/videos-api";
import type { VideoAnalysis } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";
import { AnalysisResults } from "./AnalysisResults";
import { useAnalysisPoll } from "./useAnalysisPoll";

function StateCard({
  icon,
  tone = "muted",
  title,
  description,
  children,
}: {
  icon: ReactNode;
  tone?: "muted" | "danger";
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span
        className={
          tone === "danger"
            ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500"
            : "flex h-12 w-12 items-center justify-center rounded-2xl bg-dash-bg text-dash-muted"
        }
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-dash-ink">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-md text-sm text-dash-muted">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      )}
    </Card>
  );
}

const primaryButton =
  "inline-flex items-center gap-2 rounded-xl bg-dash-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-xl border border-dash-border bg-dash-surface px-4 py-2.5 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2";

/**
 * Watches one analysis id: polls while PENDING (with ~3 min timeout),
 * renders results when COMPLETED, and failure/timeout states otherwise.
 */
export function AnalysisView({
  analysisId,
  onAnalyzeRevision,
  onRetried,
  onReset,
}: {
  analysisId: string;
  /** Re-enter the upload flow with parentAnalysisId = the given id. */
  onAnalyzeRevision: (analysisId: string) => void;
  /** Called when a retry produced a NEW analysis id (defaults to navigation). */
  onRetried?: (newAnalysisId: string) => void;
  /** Optional "analyze a different video" affordance while waiting/failed. */
  onReset?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { query, timedOut, keepWaiting } = useAnalysisPoll(analysisId);

  const retry = useAiMutation<RetryResult, void>({
    mutationFn: () => retryAnalysis(analysisId),
    onSuccess: (result) => {
      keepWaiting();
      const newId = result.analysisId;
      if (newId && newId !== analysisId) {
        if (onRetried) {
          onRetried(newId);
        } else {
          router.replace(`/video-analyzer/analysis/${newId}`);
        }
        return;
      }
      void queryClient.invalidateQueries({
        queryKey: ["/api/videos/analysis", analysisId],
      });
    },
  });

  const retryButton = (
    <button
      type="button"
      onClick={() => retry.mutate()}
      disabled={retry.isPending}
      className={primaryButton}
    >
      {retry.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      )}
      Retry analysis
    </button>
  );

  const resetButton = onReset ? (
    <button type="button" onClick={onReset} className={secondaryButton}>
      <Upload className="h-4 w-4" aria-hidden="true" />
      Analyze a different video
    </button>
  ) : null;

  // ---- Error states (load failed / not found) -----------------------------
  if (query.isError) {
    const error = query.error;
    if (error instanceof AiError && error.status === 404) {
      return (
        <StateCard
          icon={<CircleAlert className="h-5 w-5" aria-hidden="true" />}
          tone="danger"
          title="Analysis not found"
          description="It may have been deleted, or the link is incorrect."
        >
          <Link href="/recent-videos" className={secondaryButton}>
            <History className="h-4 w-4" aria-hidden="true" />
            Past analyses
          </Link>
          <Link href="/video-analyzer" className={primaryButton}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Analyze a video
          </Link>
        </StateCard>
      );
    }
    return (
      <StateCard
        icon={<CircleAlert className="h-5 w-5" aria-hidden="true" />}
        tone="danger"
        title="Couldn't load this analysis"
        description={
          error instanceof Error && error.message ? error.message : undefined
        }
      >
        <button
          type="button"
          onClick={() => void query.refetch()}
          className={primaryButton}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
        {resetButton}
      </StateCard>
    );
  }

  // ---- Initial load --------------------------------------------------------
  const analysis: VideoAnalysis | undefined = query.data;
  if (!analysis) {
    return <AiGenerating label="Loading analysis…" />;
  }

  // ---- Pending: analyzing / timed out --------------------------------------
  if (analysis.status === "PENDING") {
    if (timedOut) {
      return (
        <StateCard
          icon={<Hourglass className="h-5 w-5" aria-hidden="true" />}
          title="This is taking longer than usual"
          description="Your video is still being analyzed. You can keep waiting, or retry the analysis."
        >
          <button type="button" onClick={keepWaiting} className={secondaryButton}>
            <Hourglass className="h-4 w-4" aria-hidden="true" />
            Keep waiting
          </button>
          {retryButton}
        </StateCard>
      );
    }
    return (
      <div className="space-y-4">
        <AiGenerating
          label="Analyzing your video…"
          sublabel="This usually takes a minute or two."
        />
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-dash-muted">
          <span>
            You can leave this page — find it later in{" "}
            <Link
              href="/recent-videos"
              className="rounded font-semibold text-dash-brand transition-colors hover:text-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              Past analyses
            </Link>
            .
          </span>
          {resetButton}
        </div>
      </div>
    );
  }

  // ---- Failed ---------------------------------------------------------------
  if (analysis.status === "FAILED") {
    const reason = [analysis.error, analysis.failureReason, analysis.message]
      .filter((value): value is string => typeof value === "string" && !!value)
      .shift();
    return (
      <StateCard
        icon={<CircleAlert className="h-5 w-5" aria-hidden="true" />}
        tone="danger"
        title="Analysis failed"
        description={
          reason ??
          "Something went wrong while analyzing your video. Any credits used have been refunded."
        }
      >
        {retryButton}
        {resetButton ?? (
          <Link href="/video-analyzer" className={secondaryButton}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Analyze a different video
          </Link>
        )}
      </StateCard>
    );
  }

  // ---- Completed (or any terminal status with data — render defensively) ---
  return (
    <AnalysisResults analysis={analysis} onAnalyzeRevision={onAnalyzeRevision} />
  );
}
