"use client";

import { MessageSquareText, Play, Tag, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoAnalysis } from "@/lib/web/ai/types";
import { resolveMediaUrl } from "@/lib/web/ai/videos-api";
import { Card } from "../../dashboard/_components/ui/Card";

export function scoreTone(score: number): string {
  if (score >= 80) return "text-dash-brand";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

export function scoreBarTone(score: number): string {
  if (score >= 80) return "bg-dash-brand";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

/** Default label when the server didn't send one (mirrors the mobile app). */
function defaultScoreLabel(score: number): string {
  if (score >= 80) return "Excellent! Ready to post";
  if (score >= 60) return "Good with minor tweaks";
  if (score >= 40) return "Needs a little polish";
  return "Needs improvement";
}

/** Thumbnail + overall score (out of 10) + label + niche, with an AI-coach CTA. */
export function ScoreCard({
  analysis,
  onChatPress,
}: {
  analysis: VideoAnalysis;
  onChatPress?: () => void;
}) {
  const raw =
    typeof analysis.overallScore === "number" ? analysis.overallScore : null;
  // Backend score is 0–100; the app surfaces it out of 10 (one decimal).
  const outOfTen =
    raw === null ? null : Math.round((raw / 10) * 10) / 10;
  const label =
    analysis.scoreLabel || (raw === null ? null : defaultScoreLabel(raw));
  const thumb = resolveMediaUrl(analysis.thumbnailUrl);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        {/* Thumbnail */}
        <div className="relative w-full shrink-0 overflow-hidden rounded-dash bg-dash-border sm:w-56">
          <div className="aspect-video w-full">
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt="Video thumbnail"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-dash-muted">
                <Video className="h-9 w-9" aria-hidden="true" />
              </span>
            )}
          </div>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white">
              <Play className="h-5 w-5 translate-x-0.5 fill-current" aria-hidden="true" />
            </span>
          </span>
        </div>

        {/* Score + label */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-dash-muted">
            Your score
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p
              className={cn(
                "text-5xl font-bold leading-none",
                outOfTen === null ? "text-dash-ink" : scoreTone(raw ?? 0),
              )}
            >
              {outOfTen === null ? "—" : outOfTen}
              <span className="text-lg font-semibold text-dash-muted">/10</span>
            </p>
            {label && (
              <span className="text-base font-semibold text-dash-ink">
                {label}
              </span>
            )}
          </div>

          {analysis.detectedNiche && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-dash-brand/10 px-3 py-1 text-xs font-medium text-dash-brand">
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              {analysis.detectedNiche}
            </span>
          )}

          {analysis.scoreReasoning && (
            <p className="mt-3 text-sm leading-relaxed text-dash-muted">
              {analysis.scoreReasoning}
            </p>
          )}
        </div>
      </div>

      {onChatPress && (
        <button
          type="button"
          onClick={onChatPress}
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600/90 to-dash-brand/90 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          Chat with your AI coach for further feedback
        </button>
      )}
    </Card>
  );
}
