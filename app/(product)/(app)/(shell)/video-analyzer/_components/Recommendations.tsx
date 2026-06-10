"use client";

import { useState } from "react";
import {
  BookOpen,
  Captions,
  ChevronDown,
  CircleAlert,
  Eye,
  Magnet,
  MousePointerClick,
  Music,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AnalysisRecommendation,
  RecommendationCategory,
} from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

const CATEGORY_ORDER: RecommendationCategory[] = [
  "HOOK",
  "VISUAL_ENGAGEMENT",
  "CAPTIONS",
  "TREND_ALIGNMENT",
  "CALL_TO_ACTION",
  "AUDIO_MUSIC",
  "STORYTELLING",
];

const CATEGORY_INFO: Record<
  string,
  { title: string; description: string; icon: LucideIcon }
> = {
  HOOK: {
    title: "Hook",
    description: "Capture the attention of your viewers",
    icon: Magnet,
  },
  VISUAL_ENGAGEMENT: {
    title: "Visual Engagement",
    description: "Enhance visual appeal through editing, colors, or movement",
    icon: Eye,
  },
  CAPTIONS: {
    title: "Text on Screen",
    description: "Use on-screen text to reinforce your message",
    icon: Captions,
  },
  TREND_ALIGNMENT: {
    title: "Trend Alignment",
    description: "Align content with current trends and formats",
    icon: TrendingUp,
  },
  CALL_TO_ACTION: {
    title: "Call to Action",
    description: "Encourage the viewer to take action",
    icon: MousePointerClick,
  },
  AUDIO_MUSIC: {
    title: "Audio & Music",
    description: "Optimize audio quality and music selection",
    icon: Music,
  },
  STORYTELLING: {
    title: "Story Telling",
    description: "Identify the presence of a clear story",
    icon: BookOpen,
  },
};

function prettyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Normalize varied severity strings to a rank (0 = most urgent). */
function severityRank(severity?: string): number {
  const key = (severity ?? "").toLowerCase();
  if (key.indexOf("high") >= 0 || key.indexOf("critical") >= 0) return 0;
  if (key.indexOf("med") >= 0 || key.indexOf("moderate") >= 0) return 1;
  if (key.indexOf("low") >= 0) return 2;
  return 3;
}

function severityBadgeClass(severity?: string): string {
  switch (severityRank(severity)) {
    case 0:
      return "bg-red-50 text-red-600";
    case 1:
      return "bg-amber-50 text-amber-600";
    case 2:
      return "bg-emerald-50 text-emerald-600";
    default:
      return "bg-dash-bg text-dash-muted";
  }
}

interface CategoryGroup {
  category: RecommendationCategory;
  recommendations: AnalysisRecommendation[];
  topRank: number;
}

function groupByCategory(recs: AnalysisRecommendation[]): CategoryGroup[] {
  const map = new Map<string, AnalysisRecommendation[]>();
  const order: string[] = [];
  recs.forEach((rec) => {
    const key = (rec.category as string) || "OTHER";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(rec);
  });

  // Stable category ordering: known categories in CATEGORY_ORDER, then the rest.
  const sortedKeys = [
    ...CATEGORY_ORDER.filter((k) => map.has(k as string)),
    ...order.filter((k) => !CATEGORY_ORDER.includes(k as RecommendationCategory)),
  ];

  return sortedKeys.map((key) => {
    const list = map.get(key)!;
    const topRank = list.reduce(
      (min, r) => Math.min(min, severityRank(r.severity)),
      4,
    );
    return { category: key, recommendations: list, topRank };
  });
}

function CategoryCard({ group }: { group: CategoryGroup }) {
  const [open, setOpen] = useState(false);
  const info = CATEGORY_INFO[group.category as string];
  const Icon = info?.icon ?? CircleAlert;
  const title = info?.title ?? prettyCategory(group.category as string);
  const bodyId = `improve-${group.category}`;

  return (
    <div className="overflow-hidden rounded-dash border border-dash-border bg-dash-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-dash-ink">{title}</p>
          {info?.description && (
            <p className="truncate text-xs text-dash-muted">{info.description}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-dash-muted transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={bodyId} className="space-y-3 border-t border-dash-border px-4 py-4">
          {group.recommendations.map((rec, i) => {
            const steps = (rec.actionSteps ?? []).filter(
              (s): s is string => typeof s === "string" && s.trim().length > 0,
            );
            return (
              <div
                key={rec.id ?? i}
                className="rounded-dash bg-dash-bg/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-dash-ink">
                    {rec.title || title}
                  </p>
                  {rec.severity && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        severityBadgeClass(rec.severity),
                      )}
                    >
                      {rec.severity}
                    </span>
                  )}
                </div>
                {rec.description && (
                  <p className="mt-2 text-sm leading-relaxed text-dash-muted">
                    {rec.description}
                  </p>
                )}
                {steps.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-dash-ink">
                      Actionable steps:
                    </p>
                    <ol className="mt-1.5 space-y-1.5">
                      {steps.map((step, si) => (
                        <li key={si} className="flex gap-2 text-sm text-dash-ink">
                          <span className="font-semibold text-dash-brand">
                            {si + 1}.
                          </span>
                          <span className="flex-1 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** "What to improve first" — recommendations grouped by category, high-priority first. */
export function Recommendations({
  recommendations,
}: {
  recommendations: AnalysisRecommendation[] | undefined;
}) {
  const items = (recommendations ?? []).filter(
    (r): r is AnalysisRecommendation => !!r && typeof r === "object",
  );
  if (items.length === 0) return null;

  const groups = groupByCategory(items);
  const highPriority = groups.filter((g) => g.topRank === 0);
  const others = groups.filter((g) => g.topRank !== 0);

  return (
    <section aria-label="What to improve first">
      <div className="mb-3 flex items-center gap-2">
        <CircleAlert className="h-5 w-5 text-dash-ink" aria-hidden="true" />
        <h2 className="text-lg font-bold text-dash-ink">What to improve first</h2>
      </div>

      <Card className="space-y-3 bg-dash-bg p-3 sm:p-4">
        {highPriority.map((group) => (
          <CategoryCard key={group.category} group={group} />
        ))}

        {others.length > 0 && (
          <>
            {highPriority.length > 0 && (
              <p className="px-1 pt-1 text-xs font-semibold uppercase tracking-wide text-dash-muted">
                Other improvements
              </p>
            )}
            {others.map((group) => (
              <CategoryCard key={group.category} group={group} />
            ))}
          </>
        )}
      </Card>
    </section>
  );
}
