import type { SubscriptionOverview } from "@/lib/types/admin";

interface SubscriptionOverviewCardProps {
  data: SubscriptionOverview | null;
  error?: string;
}

export function SubscriptionOverviewCard({
  data,
  error,
}: SubscriptionOverviewCardProps) {
  const rows = data
    ? [
        { label: "Total Subscriptions", value: data.total, color: "text-gray-900" },
        { label: "Active Subscriptions", value: data.active, color: "text-green-600" },
        { label: "Cancelled Subscriptions", value: data.canceled, color: "text-red-500" },
        { label: "Trial Subscriptions", value: data.trial, color: "text-amber-600" },
      ]
    : [];

  const pct = (n: number) =>
    data && data.total > 0 ? `(${((n / data.total) * 100).toFixed(1)}%)` : "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Subscription Overview</h2>
      </div>

      {error ? (
        <div className="py-6 text-center text-sm text-red-500">{error}</div>
      ) : !data ? (
        <div className="py-6 text-center text-sm text-gray-400">No data</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{r.label}</span>
              <span className="flex items-baseline gap-1.5">
                <span className={`font-semibold ${r.color}`}>
                  {r.value.toLocaleString()}
                </span>
                {r.label !== "Total Subscriptions" && (
                  <span className="text-xs text-gray-400 tabular-nums">
                    {pct(r.value)}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
