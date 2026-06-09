"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { RevenueBreakdownResponse } from "@/lib/types/admin";

interface RevenueByPlanCardProps {
  data: RevenueBreakdownResponse | null;
  error?: string;
}

const COLORS = ["#6366f1", "#ec4899", "#0FA37F", "#f59e0b", "#3b82f6", "#a855f7"];

export function RevenueByPlanCard({ data, error }: RevenueByPlanCardProps) {
  const currency = data?.currency ?? "USD";
  const items = data?.items ?? [];
  const total = items.reduce((sum, i) => sum + i.amount, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
      <div className="flex items-start justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900">Revenue by Plan</h2>
        <div className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
          This Month
        </div>
      </div>

      {error ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-red-500">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
          No plan data yet
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative w-[160px] h-[160px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="amount"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  stroke="none"
                >
                  {items.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-lg font-bold text-gray-900">{fmt(total)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total</p>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 min-w-0">
            {items.map((item, i) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-gray-700 flex-1 truncate">{item.label}</span>
                <span className="text-gray-900 font-medium">{fmt(item.amount)}</span>
                <span className="text-gray-400 text-xs tabular-nums">
                  ({(item.share * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
