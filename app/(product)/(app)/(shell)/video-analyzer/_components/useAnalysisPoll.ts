"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AiError } from "@/lib/web/ai/client";
import type { ProcessingStep, VideoAnalysis } from "@/lib/web/ai/types";
import { getAnalysis, resolveMediaUrl, statusOf } from "@/lib/web/ai/videos-api";

/** Stop nagging the server after ~5 minutes and surface a timeout state. */
const POLL_TIMEOUT_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 2000;

const STAGE_LABELS: Record<string, string> = {
  DOWNLOADING_VIDEO: "Loading your video…",
  EXTRACTING_FRAMES: "Pulling frames and audio…",
  ANALYZING_VIDEO: "Reviewing what's on screen…",
  STREAMING_FEEDBACK: "Writing your feedback…",
  FINALIZING: "Polishing the results…",
  COMPLETED: "Done!",
};

const STAGE_BASE_PROGRESS: Record<string, number> = {
  DOWNLOADING_VIDEO: 5,
  EXTRACTING_FRAMES: 20,
  ANALYZING_VIDEO: 45,
  STREAMING_FEEDBACK: 60,
  FINALIZING: 95,
  COMPLETED: 100,
};

/** Strip JSON syntax from streamed partial output so it reads as prose. */
function sanitizeStreamingPreview(raw: string | null | undefined): string {
  if (!raw) return "";
  let s = raw;
  s = s.replace(/"[a-zA-Z_][a-zA-Z0-9_]*"\s*:\s*/g, " ");
  s = s.replace(/[{}[\]"]/g, " ");
  s = s.replace(/,(?!\s*\d)/g, " · ");
  s = s.replace(/\\n|\\t|\\r/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  if (s.length > 240) s = "…" + s.slice(-240);
  return s;
}

export interface AnalysisProgress {
  /** Current pipeline stage (defaults to DOWNLOADING_VIDEO before the server reports one). */
  stage: ProcessingStep;
  stageLabel: string;
  /** Monotonic 0–100 progress derived from stage (+ streamed text length). */
  progress: number;
  /** Cleaned partial feedback shown during STREAMING_FEEDBACK. */
  streamingPreview: string;
  /** Absolute frame URLs extracted during analysis (for the carousel). */
  frameUrls: string[];
}

export interface AnalysisPoll {
  query: UseQueryResult<VideoAnalysis, unknown>;
  progress: AnalysisProgress;
  /** True once a still-running analysis has been polling for ~5 minutes. */
  timedOut: boolean;
  /** Clear the timeout state and keep polling for another window. */
  keepWaiting: () => void;
}

/**
 * Polls GET /api/videos/analysis/:id every ~2s while the analysis is still
 * running (analysisStatus not COMPLETED/FAILED), with a ~5 min timeout the
 * caller can extend via keepWaiting(). Derives the staged progress UI from
 * `processingStep` / `streamingText` / `frameUrls`, exactly like the app.
 */
export function useAnalysisPoll(analysisId: string | null): AnalysisPoll {
  const [timedOut, setTimedOut] = useState(false);

  // Progress must never go backwards across polls.
  const progressFloorRef = useRef(0);
  // Frames are captured once (the first poll that includes them).
  const framesRef = useRef<string[]>([]);

  const query = useQuery<VideoAnalysis, unknown>({
    queryKey: ["/api/videos/analysis", analysisId],
    queryFn: () => getAnalysis(analysisId as string),
    enabled: !!analysisId,
    refetchInterval: (q) => {
      const data = q.state.data;
      if (timedOut || !data) return data ? false : POLL_INTERVAL_MS;
      return isDone(statusOf(data)) ? false : POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      if (error instanceof AiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });

  const analysis = query.data;
  const status = analysis ? statusOf(analysis) : undefined;

  // Reset derived state when watching a new analysis.
  useEffect(() => {
    setTimedOut(false);
    progressFloorRef.current = 0;
    framesRef.current = [];
  }, [analysisId]);

  // Timeout only while the analysis is still running.
  useEffect(() => {
    if (!analysisId || !status || isDone(status) || timedOut) return undefined;
    const timer = setTimeout(() => setTimedOut(true), POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [analysisId, status, timedOut]);

  const progress = useMemo<AnalysisProgress>(() => {
    const rawStep = (analysis?.processingStep as string | undefined) || null;
    const stage: ProcessingStep =
      status === "COMPLETED"
        ? "COMPLETED"
        : rawStep && rawStep in STAGE_BASE_PROGRESS
          ? (rawStep as ProcessingStep)
          : "DOWNLOADING_VIDEO";

    let computed = STAGE_BASE_PROGRESS[stage] ?? 5;
    if (stage === "STREAMING_FEEDBACK" && typeof analysis?.streamingText === "string") {
      const grown = Math.min(30, Math.round((analysis.streamingText.length / 4000) * 30));
      computed = Math.min(90, STAGE_BASE_PROGRESS.STREAMING_FEEDBACK + grown);
    }
    const monotonic = Math.max(progressFloorRef.current, computed);
    progressFloorRef.current = monotonic;

    if (
      framesRef.current.length === 0 &&
      Array.isArray(analysis?.frameUrls) &&
      analysis.frameUrls.length > 0
    ) {
      framesRef.current = analysis.frameUrls
        .map((u) => resolveMediaUrl(u))
        .filter((u): u is string => !!u);
    }

    return {
      stage,
      stageLabel: STAGE_LABELS[stage] ?? "Analyzing your video…",
      progress: monotonic,
      streamingPreview:
        stage === "STREAMING_FEEDBACK"
          ? sanitizeStreamingPreview(analysis?.streamingText)
          : "",
      frameUrls: framesRef.current,
    };
    // analysis identity changes each poll; that's the intended trigger.
  }, [analysis, status]);

  const keepWaiting = useCallback(() => setTimedOut(false), []);

  return { query, progress, timedOut, keepWaiting };
}

function isDone(status: string | undefined): boolean {
  return status === "COMPLETED" || status === "FAILED";
}
