"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AiError } from "@/lib/web/ai/client";
import type { VideoAnalysis } from "@/lib/web/ai/types";
import { getAnalysis } from "@/lib/web/ai/videos-api";

/** Stop nagging the server after ~3 minutes and surface a timeout state. */
const POLL_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 2500;

export interface AnalysisPoll {
  query: UseQueryResult<VideoAnalysis, unknown>;
  /** True once a PENDING analysis has been polling for ~3 minutes. */
  timedOut: boolean;
  /** Clear the timeout state and keep polling for another ~3 minutes. */
  keepWaiting: () => void;
}

/**
 * Polls GET /api/videos/analysis/:id every ~2.5s while the analysis is
 * PENDING, with a ~3 minute timeout the caller can extend via keepWaiting().
 */
export function useAnalysisPoll(analysisId: string | null): AnalysisPoll {
  const [timedOut, setTimedOut] = useState(false);

  const query = useQuery<VideoAnalysis, unknown>({
    queryKey: ["/api/videos/analysis", analysisId],
    queryFn: () => getAnalysis(analysisId as string),
    enabled: !!analysisId,
    refetchInterval: (q) =>
      !timedOut && q.state.data?.status === "PENDING"
        ? POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      if (error instanceof AiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });

  const status = query.data?.status;

  // Reset the timeout whenever we start watching a new analysis.
  useEffect(() => {
    setTimedOut(false);
  }, [analysisId]);

  useEffect(() => {
    if (!analysisId || status !== "PENDING" || timedOut) return undefined;
    const timer = setTimeout(() => setTimedOut(true), POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [analysisId, status, timedOut]);

  const keepWaiting = useCallback(() => setTimedOut(false), []);

  return { query, timedOut, keepWaiting };
}
