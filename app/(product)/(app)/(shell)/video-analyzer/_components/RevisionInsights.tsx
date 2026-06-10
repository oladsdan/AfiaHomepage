"use client";

import Link from "next/link";
import { ArrowUpRight, GitCompareArrows } from "lucide-react";
import type { VideoAnalysis } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

function prettifyKey(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function PrimitiveValue({ value }: { value: string | number | boolean }) {
  if (typeof value === "number") {
    return (
      <span className="font-semibold tabular-nums text-dash-ink">
        {value > 0 ? `+${value}` : value}
      </span>
    );
  }
  if (typeof value === "boolean") {
    return (
      <span className="font-semibold text-dash-ink">{value ? "Yes" : "No"}</span>
    );
  }
  return <span className="text-dash-ink">{value}</span>;
}

/** Renders one level of key/value rows; nests one extra level for objects. */
function EntryRows({
  data,
  depth = 0,
}: {
  data: Record<string, unknown>;
  depth?: number;
}) {
  const keys = Object.keys(data);
  if (keys.length === 0) return null;

  return (
    <dl className="space-y-2">
      {keys.map((key) => {
        const value = data[key];

        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return (
            <div key={key} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-dash-muted">{prettifyKey(key)}</dt>
              <dd className="text-right text-sm">
                <PrimitiveValue value={value} />
              </dd>
            </div>
          );
        }

        if (Array.isArray(value)) {
          const strings = value.filter(
            (item): item is string => typeof item === "string" && item.length > 0,
          );
          if (strings.length === 0) return null;
          return (
            <div key={key}>
              <dt className="text-sm text-dash-muted">{prettifyKey(key)}</dt>
              <dd className="mt-1">
                <ul className="list-disc space-y-1 pl-5 text-sm text-dash-ink">
                  {strings.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          );
        }

        if (isPlainObject(value) && depth < 1) {
          return (
            <div key={key}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
                {prettifyKey(key)}
              </dt>
              <dd className="mt-1.5 rounded-dash bg-dash-bg/60 px-3 py-2">
                <EntryRows data={value} depth={depth + 1} />
              </dd>
            </div>
          );
        }

        return null;
      })}
    </dl>
  );
}

/**
 * Shown only for revision analyses (revisionNumber > 0 or parentAnalysisId):
 * surfaces whatever improvement/comparison data the server returned.
 */
export function RevisionInsights({ analysis }: { analysis: VideoAnalysis }) {
  const isRevision =
    (typeof analysis.revisionNumber === "number" &&
      analysis.revisionNumber > 0) ||
    !!analysis.parentAnalysisId;
  if (!isRevision) return null;

  const improvement = isPlainObject(analysis.improvement)
    ? analysis.improvement
    : null;
  const comparison = isPlainObject(analysis.comparison)
    ? analysis.comparison
    : null;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dash-brand/10 text-dash-brand">
            <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold text-dash-ink">
            Revision insights
            {typeof analysis.revisionNumber === "number" &&
              analysis.revisionNumber > 0 && (
                <span className="ml-2 rounded-full bg-dash-brand/10 px-2 py-0.5 text-[11px] font-semibold text-dash-brand">
                  Revision #{analysis.revisionNumber}
                </span>
              )}
          </h2>
        </div>

        {analysis.parentAnalysisId && (
          <Link
            href={`/video-analyzer/analysis/${analysis.parentAnalysisId}`}
            className="inline-flex items-center gap-1 rounded text-sm font-semibold text-dash-brand transition-colors hover:text-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
          >
            View previous analysis
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {improvement || comparison ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {improvement && (
            <div className="rounded-dash border border-dash-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
                Improvement
              </p>
              <div className="mt-2">
                <EntryRows data={improvement} />
              </div>
            </div>
          )}
          {comparison && (
            <div className="rounded-dash border border-dash-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
                Compared with previous version
              </p>
              <div className="mt-2">
                <EntryRows data={comparison} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-dash-muted">
          This is a revision of an earlier video. Comparison details aren&apos;t
          available for this analysis.
        </p>
      )}
    </Card>
  );
}
