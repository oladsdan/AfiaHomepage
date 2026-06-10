"use client";

import type { VideoAnalysis } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";
import { scoreBarTone } from "./ScoreCard";

const CATEGORIES: Array<{ key: keyof VideoAnalysis; label: string }> = [
  { key: "hookScore", label: "Hook" },
  { key: "storytellingScore", label: "Storytelling" },
  { key: "visualScore", label: "Visuals" },
  { key: "audioScore", label: "Audio" },
  { key: "ctaScore", label: "Call to action" },
  { key: "captionsScore", label: "Captions" },
  { key: "trendScore", label: "Trend potential" },
];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/** Horizontal bars for the seven category sub-scores; skips missing ones. */
export function CategoryScores({ analysis }: { analysis: VideoAnalysis }) {
  const rows = CATEGORIES.map((category) => {
    const raw = analysis[category.key];
    return typeof raw === "number" && Number.isFinite(raw)
      ? { ...category, score: clamp(raw) }
      : null;
  }).filter((row): row is { key: keyof VideoAnalysis; label: string; score: number } => row !== null);

  if (rows.length === 0) return null;

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-dash-ink">Category scores</h2>
      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={String(row.key)}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-dash-ink">
                {row.label}
              </span>
              <span className="text-sm font-semibold tabular-nums text-dash-ink">
                {row.score}
              </span>
            </div>
            <div
              role="meter"
              aria-label={`${row.label} score`}
              aria-valuenow={row.score}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-1.5 h-2 overflow-hidden rounded-full bg-dash-bg"
            >
              <div
                className={`h-full rounded-full transition-all ${scoreBarTone(row.score)}`}
                style={{ width: `${row.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
