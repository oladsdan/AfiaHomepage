"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenueTimeseriesResponse } from "@/lib/types/admin";
import { adminFetch } from "../lib/adminFetch";
import { GranularityToggle, type Granularity } from "./GranularityToggle";

interface RevenueProfitChartProps {
  initial: RevenueTimeseriesResponse | null;
  initialError?: string;
}

export function RevenueProfitChart({
  initial,
  initialError,
}: RevenueProfitChartProps) {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [data, setData] = useState<RevenueTimeseriesResponse | null>(initial);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);

  const currency = "USD";

  const handleGranularity = async (g: Granularity) => {
    if (g === granularity) return;
    setGranularity(g);
    setLoading(true);
    setError(null);
    try {
      const next = await adminFetch<RevenueTimeseriesResponse>(
        `/api/admin/revenue/timeseries?granularity=${g}`,
      );
      setData(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const formatted = (data?.points ?? []).map((p) => ({
    revenue: p.amount,
    label: new Date(p.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Revenue vs Cost vs Profit
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Per-day cost &amp; profit coming soon
          </p>
        </div>
        <GranularityToggle
          value={granularity}
          onChange={handleGranularity}
          disabled={loading}
        />
      </div>

      {error ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-red-500">
          {error}
        </div>
      ) : formatted.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
          No revenue data yet
        </div>
      ) : (
        <div className="relative h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formatted}
            margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(0, Math.floor(formatted.length / 6) - 1)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(v)
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
              formatter={(value: number) => [
                formatCurrency(value),
                "Amount Sold",
              ]}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#6366f1" }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-indigo-500" />
          Amount Sold (USD)
        </span>
        <span className="inline-flex items-center gap-1.5 text-gray-400">
          <span className="w-3 border-t border-dashed border-pink-500" />
          Actual Cost (USD)
        </span>
        <span className="inline-flex items-center gap-1.5 text-gray-400">
          <span className="w-3 border-t border-dashed border-emerald-500" />
          Gross Profit (USD)
        </span>
      </div>
    </div>
  );
}
