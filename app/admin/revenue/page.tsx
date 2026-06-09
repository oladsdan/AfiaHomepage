"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient, useIsFetching } from "@tanstack/react-query";
import {
  Cpu,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";
import type {
  RevenueSummary,
  RevenueTimeseriesResponse,
  RevenueDailyBreakdownResponse,
  StatsResponse,
} from "@/lib/types/admin";
import { RevenueKpiCard } from "../components/RevenueKpiCard";
import { CreditCostChart } from "../components/CreditCostChart";
import { RevenueProfitChart } from "../components/RevenueProfitChart";
import { RevenueBreakdownTable } from "../components/RevenueBreakdownTable";
import { queryFetch, errorMessage } from "../lib/queryFetch";

function formatCurrency(n: number | null | undefined): string {
  if (n === undefined || n === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

function fmtRange(start: Date, end: Date): string {
  return `${start.toLocaleDateString("en-US", DATE_OPTS)} – ${end.toLocaleDateString("en-US", DATE_OPTS)}`;
}

function fmtIsoRange(startIso: string, endIso: string): string {
  return fmtRange(new Date(startIso), new Date(endIso));
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function AdminRevenue() {
  const dateBounds = useMemo(() => {
    const today = new Date();
    const curEnd = new Date(today);
    const curStart = new Date(today);
    curStart.setDate(curEnd.getDate() - 30);
    return {
      curFrom: isoDate(curStart),
      curTo: isoDate(curEnd),
      range: fmtRange(curStart, curEnd),
    };
  }, []);

  const { curFrom, curTo, range } = dateBounds;

  const queryClient = useQueryClient();
  const adminFetchingCount = useIsFetching({ queryKey: ["admin"] });
  const [refreshClicked, setRefreshClicked] = useState(false);
  const isRefreshing = refreshClicked && adminFetchingCount > 0;
  useEffect(() => {
    if (refreshClicked && adminFetchingCount === 0) {
      setRefreshClicked(false);
    }
  }, [refreshClicked, adminFetchingCount]);
  const handleRefresh = () => {
    setRefreshClicked(true);
    queryClient.invalidateQueries({ queryKey: ["admin"] });
  };

  const summaryQ = useQuery({
    queryKey: ["admin", "revenue", "summary", { from: curFrom, to: curTo }],
    queryFn: () =>
      queryFetch<RevenueSummary>(
        `/api/admin/revenue/summary?from=${curFrom}&to=${curTo}`,
      ),
  });
  const timeseriesQ = useQuery({
    queryKey: ["admin", "revenue", "timeseries", { granularity: "day" }],
    queryFn: () =>
      queryFetch<RevenueTimeseriesResponse>(
        "/api/admin/revenue/timeseries?granularity=day",
      ),
  });
  const statsQ = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => queryFetch<StatsResponse>("/api/admin/stats"),
  });
  const breakdownQ = useQuery({
    queryKey: [
      "admin",
      "revenue",
      "breakdown",
      { from: curFrom, to: curTo, granularity: "day" },
    ],
    queryFn: () =>
      queryFetch<RevenueDailyBreakdownResponse>(
        `/api/admin/revenue/breakdown?from=${curFrom}&to=${curTo}&granularity=day`,
      ),
  });

  const summary = summaryQ.data ?? null;
  const summaryErr = errorMessage(summaryQ.error);
  const timeseries = timeseriesQ.data ?? null;
  const timeseriesErr = errorMessage(timeseriesQ.error);
  const stats = statsQ.data ?? null;
  const statsErr = errorMessage(statsQ.error);
  const breakdown = breakdownQ.data ?? null;
  const breakdownErr = errorMessage(breakdownQ.error);

  const tokensTotal = stats?.ai?.tokensConsumed?.total;
  const actualCost = summary?.actualCostUsd;
  const grossProfit = summary?.grossProfitUsd;

  const priorRangeLabel = summary?.prior?.range
    ? fmtIsoRange(summary.prior.range.start, summary.prior.range.end)
    : range;

  function deltaFromPct(
    pct: number | null | undefined,
  ): { direction: "up" | "down"; percent: number; range: string } | undefined {
    if (pct == null || !Number.isFinite(pct)) return undefined;
    return {
      direction: pct >= 0 ? "up" : "down",
      percent: Math.abs(pct),
      range: priorRangeLabel,
    };
  }

  const amountSoldDelta = deltaFromPct(summary?.deltas?.amountSoldPct);
  const grossProfitDelta = deltaFromPct(summary?.deltas?.grossProfitPct);
  const actualCostDelta = deltaFromPct(summary?.deltas?.actualCostPct);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-geist">
            Revenue
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track AI credit consumption and actual revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium">
            {range}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            disabled
            title="Coming soon"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <RevenueKpiCard
          label="AI Credit Consumed"
          value={
            tokensTotal != null
              ? `${tokensTotal.toLocaleString()} tokens`
              : "—"
          }
          error={statsErr}
          range={range}
          icon={<Cpu className="w-5 h-5 text-indigo-500" />}
          iconBg="bg-indigo-50"
        />
        <RevenueKpiCard
          label="Actual Cost (AI Provider)"
          value={formatCurrency(actualCost)}
          error={summaryErr}
          delta={actualCostDelta}
          range={range}
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
          iconBg="bg-emerald-50"
        />
        <RevenueKpiCard
          label="Amount Sold to Users"
          value={formatCurrency(summary?.amountSoldUsd)}
          error={summaryErr}
          delta={amountSoldDelta}
          range={range}
          icon={<ShoppingCart className="w-5 h-5 text-amber-500" />}
          iconBg="bg-amber-50"
        />
        <RevenueKpiCard
          label="Gross Profit"
          value={formatCurrency(grossProfit)}
          error={summaryErr}
          delta={grossProfitDelta}
          range={range}
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CreditCostChart />
        <RevenueProfitChart
          initial={timeseries}
          initialError={timeseriesErr}
        />
      </div>

      <RevenueBreakdownTable data={breakdown} error={breakdownErr} />
    </div>
  );
}
