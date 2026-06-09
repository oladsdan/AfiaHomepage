"use client";

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

interface RevenueChartProps {
  data: RevenueTimeseriesResponse | null;
  error?: string;
}

export function RevenueChart({ data, error }: RevenueChartProps) {
  const currency = "USD";

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  const formatted = (data?.points ?? []).map((p) => ({
    amount: p.amount,
    label: new Date(p.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    fullDate: p.date,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Revenue Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last 30 days</p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
          Daily
        </div>
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
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={formatted} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
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
              tickFormatter={(v: number) => {
                const compact = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(v);
                return compact;
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
              formatter={(value: number) => [formatCurrency(value), "Revenue"]}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#6366f1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
