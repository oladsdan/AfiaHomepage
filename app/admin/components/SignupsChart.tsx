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

interface SignupsChartProps {
  data: Array<{ date: string; count: number }>;
}

export function SignupsChart({ data }: SignupsChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-6">Signups — Last 30 Days</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              fontSize: 13,
            }}
            formatter={(value: number) => [value, "Signups"]}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0FA37F"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#0FA37F" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
