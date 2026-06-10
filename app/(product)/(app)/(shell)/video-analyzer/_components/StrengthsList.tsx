"use client";

import {
  BookOpen,
  Captions,
  CheckSquare,
  Eye,
  Magnet,
  MousePointerClick,
  Music,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { AnalysisRecommendation, VideoAnalysis } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

const CATEGORY_META: Record<string, { title: string; icon: LucideIcon }> = {
  HOOK: { title: "Hook", icon: Magnet },
  VISUAL_ENGAGEMENT: { title: "Visual Engagement", icon: Eye },
  CAPTIONS: { title: "Text on Screen", icon: Captions },
  TREND_ALIGNMENT: { title: "Trend Alignment", icon: TrendingUp },
  CALL_TO_ACTION: { title: "Call to Action", icon: MousePointerClick },
  AUDIO_MUSIC: { title: "Audio & Music", icon: Music },
  STORYTELLING: { title: "Story Telling", icon: BookOpen },
};

function prettyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * "What you're doing well" — shows a category only when the AI gave a
 * non-empty, video-specific strength AND there is no recommendation against
 * it (mirrors the mobile LookingGood logic).
 */
export function StrengthsList({ analysis }: { analysis: VideoAnalysis }) {
  const strengths = analysis.categoryStrengths;
  if (!strengths || typeof strengths !== "object") return null;

  const flaggedCategories = new Set(
    (analysis.recommendations ?? [])
      .map((r: AnalysisRecommendation) => (r?.category as string) || "")
      .filter(Boolean),
  );

  const entries = Object.keys(strengths)
    .map((category) => ({ category, text: (strengths[category] ?? "").trim() }))
    .filter((e) => e.text.length > 0 && !flaggedCategories.has(e.category));

  if (entries.length === 0) return null;

  return (
    <section aria-label="What you're doing well">
      <div className="mb-3 flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-dash-ink" aria-hidden="true" />
        <h2 className="text-lg font-bold text-dash-ink">
          What you&apos;re doing well
        </h2>
      </div>

      <Card className="divide-y divide-dash-border overflow-hidden">
        {entries.map(({ category, text }) => {
          const meta = CATEGORY_META[category];
          const Icon = meta?.icon ?? CheckSquare;
          const title = meta?.title ?? prettyCategory(category);
          return (
            <div key={category} className="flex items-start gap-3 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dash-brand/10 text-dash-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dash-ink">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-dash-muted">
                  {text}
                </p>
              </div>
            </div>
          );
        })}
      </Card>
    </section>
  );
}
