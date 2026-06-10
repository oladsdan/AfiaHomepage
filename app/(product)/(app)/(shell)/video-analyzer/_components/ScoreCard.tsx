"use client";

import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoAnalysis } from "@/lib/web/ai/types";
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

/** Big overall score + label + reasoning + niche chip + thumbnail. */
export function ScoreCard({ analysis }: { analysis: VideoAnalysis }) {
  const score =
    typeof analysis.overallScore === "number" ? analysis.overallScore : null;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-dash-muted">
            Overall score
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p
              className={cn(
                "text-5xl font-bold leading-none",
                score === null ? "text-dash-ink" : scoreTone(score),
              )}
            >
              {score === null ? "—" : score}
              <span className="text-lg font-semibold text-dash-muted">
                /100
              </span>
            </p>
            {analysis.scoreLabel && (
              <span className="text-base font-semibold text-dash-ink">
                {analysis.scoreLabel}
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

        {analysis.thumbnailUrl && (
          <div className="w-full shrink-0 overflow-hidden rounded-dash bg-dash-border sm:w-48">
            {/* Remote thumbnail host isn't configured for next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={analysis.thumbnailUrl}
              alt="Video thumbnail"
              className="aspect-video w-full object-cover"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
