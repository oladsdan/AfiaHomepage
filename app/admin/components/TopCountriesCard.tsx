import type { RevenueBreakdownResponse } from "@/lib/types/admin";

interface TopCountriesCardProps {
  data: RevenueBreakdownResponse | null;
  error?: string;
}

export function TopCountriesCard({ data, error }: TopCountriesCardProps) {
  const items = (data?.items ?? []).slice(0, 5);
  const max = items.reduce((m, i) => Math.max(m, i.amount), 0);
  const currency = data?.currency ?? "USD";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Top Countries</h2>
        <div className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
          This Month
        </div>
      </div>

      {error ? (
        <div className="py-6 text-center text-sm text-red-500">{error}</div>
      ) : items.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-400">
          No country data yet
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const widthPct = max > 0 ? (item.amount / max) * 100 : 0;
            return (
              <li key={item.label} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 truncate">{item.label}</span>
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-medium text-gray-900 tabular-nums">
                      {fmt(item.amount)}
                    </span>
                    <span className="text-xs text-gray-400 tabular-nums">
                      ({(item.share * 100).toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#6366f1] rounded-full"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
