"use client";

import { useEffect, useState } from "react";
import { Play, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisProgress } from "./useAnalysisPoll";

/**
 * Full-bleed "Analyzing video" screen — the web counterpart of the mobile
 * AnalyzingScreen: gradient backdrop, a frame carousel (falls back to the
 * thumbnail), staged label with a shimmer, a progress bar + percentage, and
 * the streamed feedback preview.
 */
export function AnalyzingScreen({
  progress,
  thumbnailUrl,
}: {
  progress: AnalysisProgress;
  thumbnailUrl?: string | null;
}) {
  const { stageLabel, progress: percent, streamingPreview, frameUrls } = progress;

  // Cycle through extracted frames like the mobile carousel.
  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    if (frameUrls.length <= 1) return undefined;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameUrls.length);
    }, 2000);
    return () => clearInterval(id);
  }, [frameUrls.length]);

  const activeFrame =
    frameUrls.length > 0 ? frameUrls[Math.min(frameIndex, frameUrls.length - 1)] : null;
  const previewSrc = activeFrame ?? thumbnailUrl ?? null;

  return (
    <section
      aria-label="Analyzing video"
      aria-live="polite"
      className="relative overflow-hidden rounded-dash-lg bg-gradient-to-br from-dash-hero-from via-dash-hero-via to-dash-hero-to px-6 py-10 text-center shadow-dash-md sm:px-10 sm:py-14"
    >
      {/* Soft animated glow blobs */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 animate-pulse rounded-full bg-white/10 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 animate-pulse rounded-full bg-dash-brand/20 blur-3xl"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Analyzing video</h2>
        <p className="mt-1 text-sm font-medium tabular-nums text-white/80">
          {percent}%
        </p>

        {/* Frame carousel / thumbnail */}
        <div className="relative mt-6 aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-dash-lg border-4 border-white/30 bg-white/10">
          {frameUrls.length > 0 ? (
            frameUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url + i}
                src={url}
                alt=""
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                  i === Math.min(frameIndex, frameUrls.length - 1)
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
            ))
          ) : previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-white/70">
              <Video className="h-12 w-12" aria-hidden="true" />
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white">
              <Play className="h-6 w-6 translate-x-0.5 fill-current" aria-hidden="true" />
            </span>
          </span>
        </div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-label="Analysis progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/20"
        >
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Stage label with shimmer */}
        <p className="ai-shimmer mt-6 text-base font-semibold">{stageLabel}</p>

        {streamingPreview && (
          <p className="mt-3 line-clamp-3 text-sm italic leading-relaxed text-white/75">
            {streamingPreview}
          </p>
        )}
      </div>
    </section>
  );
}
