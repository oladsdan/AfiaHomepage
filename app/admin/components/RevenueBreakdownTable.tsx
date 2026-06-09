import type { RevenueDailyBreakdownResponse } from "@/lib/types/admin";

interface RevenueBreakdownTableProps {
  data: RevenueDailyBreakdownResponse | null;
  error?: string;
}

export function RevenueBreakdownTable({
  data,
  error,
}: RevenueBreakdownTableProps) {
  const rows = (data?.rows ?? []).slice(-30).reverse();
  const totals = data?.totals;

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const fmtMargin = (m: number | null | undefined) =>
    m == null ? "—" : `${m.toFixed(1)}%`;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Revenue Overview
        </h2>
        <div className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
          This Month
        </div>
      </div>

      {error ? (
        <div className="px-6 py-12 text-center text-sm text-red-500">
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-400">
          No revenue data yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Date
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  AI Credit Consumed
                  <div className="text-[10px] font-normal normal-case text-gray-400 mt-0.5">
                    (credits)
                  </div>
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Actual Cost
                  <div className="text-[10px] font-normal normal-case text-gray-400 mt-0.5">
                    (USD)
                  </div>
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Amount Sold to Users
                  <div className="text-[10px] font-normal normal-case text-gray-400 mt-0.5">
                    (USD)
                  </div>
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Gross Profit
                  <div className="text-[10px] font-normal normal-case text-gray-400 mt-0.5">
                    (USD)
                  </div>
                </th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Margin
                  <div className="text-[10px] font-normal normal-case text-gray-400 mt-0.5">
                    (%)
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((r) => (
                <tr key={r.date} className="hover:bg-gray-50/40">
                  <td className="px-6 py-3.5 text-gray-700 whitespace-nowrap">
                    {fmtDate(r.date)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-900 tabular-nums">
                    {r.aiCreditsConsumed.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-900 tabular-nums">
                    {fmtCurrency(r.actualCostUsd)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-900 font-medium tabular-nums">
                    {fmtCurrency(r.amountSoldUsd)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-900 tabular-nums">
                    {fmtCurrency(r.grossProfitUsd)}
                  </td>
                  <td className="px-6 py-3.5 text-right text-gray-700 tabular-nums">
                    {fmtMargin(r.marginPct)}
                  </td>
                </tr>
              ))}
              {totals ? (
                <tr className="border-t-2 border-gray-100 bg-gray-50/60 font-semibold">
                  <td className="px-6 py-3.5 text-gray-900">Total</td>
                  <td className="px-4 py-3.5 text-right text-gray-900 tabular-nums">
                    {totals.aiCreditsConsumed.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-900 tabular-nums">
                    {fmtCurrency(totals.actualCostUsd)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-indigo-600 tabular-nums">
                    {fmtCurrency(totals.amountSoldUsd)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-900 tabular-nums">
                    {fmtCurrency(totals.grossProfitUsd)}
                  </td>
                  <td className="px-6 py-3.5 text-right text-gray-900 tabular-nums">
                    {fmtMargin(totals.marginPct)}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
