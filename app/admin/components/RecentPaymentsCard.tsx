import { CreditCard } from "lucide-react";
import type { RecentPaymentsResponse } from "@/lib/types/admin";

interface RecentPaymentsCardProps {
  data: RecentPaymentsResponse | null;
  error?: string;
}

function statusStyle(status: string): string {
  const s = status.toLowerCase();
  if (s === "paid" || s === "succeeded" || s === "success") {
    return "bg-green-50 text-green-700";
  }
  if (s === "failed" || s === "declined" || s === "error") {
    return "bg-red-50 text-red-700";
  }
  if (s === "pending" || s === "processing") {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-gray-100 text-gray-600";
}

export function RecentPaymentsCard({ data, error }: RecentPaymentsCardProps) {
  const payments = (data?.payments ?? []).slice(0, 6);

  const fmtAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Recent Payments</h2>
      </div>

      {error ? (
        <div className="py-8 text-center text-sm text-red-500">{error}</div>
      ) : payments.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">No recent payments</div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {payments.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 py-2.5"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Payment from {p.userEmail || p.userId}
                </p>
                {p.provider && (
                  <p className="text-xs text-gray-400 truncate">{p.provider}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {fmtAmount(p.amount, p.currency)}
                </p>
                <p className="text-[11px] text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusStyle(
                  p.status,
                )}`}
              >
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
