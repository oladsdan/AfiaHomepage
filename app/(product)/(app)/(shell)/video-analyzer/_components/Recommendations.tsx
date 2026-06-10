"use client";

import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisRecommendation } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  moderate: 2,
  low: 3,
};

function severityRank(severity?: string): number {
  if (!severity) return 4;
  const rank = SEVERITY_RANK[severity.toLowerCase()];
  return rank === undefined ? 4 : rank;
}

function severityBadgeClass(severity?: string): string {
  const key = (severity ?? "").toLowerCase();
  if (key === "critical" || key === "high") return "bg-red-50 text-red-600";
  if (key === "medium" || key === "moderate") return "bg-amber-50 text-amber-600";
  if (key === "low") return "bg-blue-50 text-blue-600";
  return "bg-dash-bg text-dash-muted";
}

function formatTimestamp(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    const total = Math.max(0, Math.round(value));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  return String(value);
}

function TimestampChip({ value }: { value: string | number | null | undefined }) {
  const formatted = formatTimestamp(value);
  if (!formatted) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-dash-bg px-2 py-0.5 text-[11px] font-medium tabular-nums text-dash-muted">
      <Clock className="h-3 w-3" aria-hidden="true" />
      {formatted}
    </span>
  );
}

function RecommendationCard({
  recommendation,
  index,
}: {
  recommendation: AnalysisRecommendation;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  const title = recommendation.title || recommendation.category || "Recommendation";
  const bodyId = `recommendation-body-${index}`;

  const observations = (recommendation.observations ?? []).filter(
    (o): o is string => typeof o === "string" && o.length > 0,
  );
  const steps = (recommendation.actionSteps ?? []).filter(
    (s) => s && typeof s.step === "string" && s.step.length > 0,
  );

  return (
    <div className="rounded-dash border border-dash-border bg-dash-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center gap-3 rounded-dash px-4 py-3 text-left transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {recommendation.severity && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  severityBadgeClass(recommendation.severity),
                )}
              >
                {recommendation.severity}
              </span>
            )}
            {recommendation.category && (
              <span className="text-xs font-medium text-dash-muted">
                {recommendation.category}
              </span>
            )}
            <TimestampChip value={recommendation.timestamp} />
          </div>
          <p className="mt-1 text-sm font-semibold text-dash-ink">{title}</p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-dash-muted transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={bodyId} className="border-t border-dash-border px-4 py-4">
          {recommendation.description && (
            <p className="text-sm leading-relaxed text-dash-muted">
              {recommendation.description}
            </p>
          )}

          {observations.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
                Observations
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-dash-ink">
                {observations.map((observation, i) => (
                  <li key={i}>{observation}</li>
                ))}
              </ul>
            </div>
          )}

          {steps.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
                Action steps
              </p>
              <ol className="mt-1.5 space-y-1.5 text-sm text-dash-ink">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dash-brand/10 text-[11px] font-semibold text-dash-brand">
                      {i + 1}
                    </span>
                    <span className="flex-1">
                      {step.step}{" "}
                      <TimestampChip value={step.timestamp} />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Recommendations sorted by severity (critical/high first), expandable. */
export function Recommendations({
  recommendations,
}: {
  recommendations: AnalysisRecommendation[] | undefined;
}) {
  const items = (recommendations ?? []).filter(
    (r): r is AnalysisRecommendation => !!r && typeof r === "object",
  );
  if (items.length === 0) return null;

  const sorted = items
    .map((recommendation, originalIndex) => ({ recommendation, originalIndex }))
    .sort(
      (a, b) =>
        severityRank(a.recommendation.severity) -
          severityRank(b.recommendation.severity) ||
        a.originalIndex - b.originalIndex,
    );

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-dash-ink">Recommendations</h2>
      <div className="mt-4 space-y-3">
        {sorted.map((entry, index) => (
          <RecommendationCard
            key={entry.originalIndex}
            recommendation={entry.recommendation}
            index={index}
          />
        ))}
      </div>
    </Card>
  );
}
