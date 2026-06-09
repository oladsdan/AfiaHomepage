"use client";

import { ChevronRight, Flame } from "lucide-react";
import type { MetricCard } from "@/lib/web/dashboard-types";
import { metrics } from "@/lib/web/dashboard-data";
import { Card } from "../ui/Card";
import { TrendIndicator } from "../ui/TrendIndicator";
import { Sparkline } from "../ui/Sparkline";

function MetricTile({ metric }: { metric: MetricCard }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-dash-muted">{metric.label}</p>
      <p className="mt-1.5 text-2xl font-bold text-dash-ink">{metric.value}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <TrendIndicator trend={metric.trend} />
        <Sparkline data={metric.sparkline} color={metric.sparkColor} />
      </div>
    </Card>
  );
}

export function StatsRow() {
  return (
    <section
      aria-label="Social metrics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      <Card className="flex items-center justify-between gap-3 p-4 sm:col-span-2 xl:col-span-1">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-brand/10 text-dash-brand">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-dash-ink">
              See your social metrics
            </p>
            <p className="text-xs text-dash-muted">
              Your content performance is up 49%
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="See your social metrics"
          className="rounded-lg p-1.5 text-dash-muted hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </Card>

      {metrics.map((metric) => (
        <MetricTile key={metric.id} metric={metric} />
      ))}
    </section>
  );
}
