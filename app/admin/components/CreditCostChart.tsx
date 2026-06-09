"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { GranularityToggle, type Granularity } from "./GranularityToggle";

interface AiUsagePoint {
  date: string;
  credits: number;
  cost: number;
}

export function CreditCostChart() {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [points, setPoints] = useState<AiUsagePoint[]>([]);
  const [loading, setLoading] = useState(false);

  const subtitleByGranularity =
    granularity === "day"
      ? "Daily"
      : granularity === "week"
        ? "Weekly"
        : "Monthly";

  const handleGranularity = async (g: Granularity) => {
    if (g === granularity) return;
    setGranularity(g);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ai-usage?granularity=${g}`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = (await res.json()) as {
          success: boolean;
          data?: { points?: AiUsagePoint[] };
        };
        if (json.success) {
          setPoints(json.data?.points ?? []);
        } else {
          setPoints([]);
        }
      } else {
        setPoints([]);
      }
    } catch {
      setPoints([]);
    } finally {
      setLoading(false);
    }
  };

  const hasData = points.length > 0;
  const chartData = points.map((p) => ({
    label: new Date(p.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    credits: p.credits,
    cost: p.cost,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            AI Credit Consumption vs Actual Cost
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitleByGranularity}</p>
        </div>
        <GranularityToggle
          value={granularity}
          onChange={handleGranularity}
          disabled={loading}
        />
      </div>

      <div className="relative h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 0, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="credits"
              orientation="left"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "credits",
                angle: -90,
                position: "insideLeft",
                offset: 16,
                style: { fontSize: 10, fill: "#9ca3af" },
              }}
            />
            <YAxis
              yAxisId="cost"
              orientation="right"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "USD",
                angle: 90,
                position: "insideRight",
                offset: 8,
                style: { fontSize: 10, fill: "#9ca3af" },
              }}
            />
            <Line
              yAxisId="credits"
              type="monotone"
              dataKey="credits"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              yAxisId="cost"
              type="monotone"
              dataKey="cost"
              stroke="#ec4899"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-white/85 backdrop-blur-sm border border-gray-100 text-xs text-gray-500">
              Awaiting AI usage data source
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-indigo-500" />
          AI Credit Consumed (credits)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-pink-500" />
          Actual Cost (USD)
        </span>
      </div>
    </div>
  );
}
