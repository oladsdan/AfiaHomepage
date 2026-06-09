import { ReactNode } from "react";

interface RevenueKpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg?: string;
  error?: string;
  emptyMessage?: string;
  delta?: {
    direction: "up" | "down";
    percent: number;
    range: string;
  };
  range?: string;
}

export function RevenueKpiCard({
  label,
  value,
  icon,
  iconBg = "bg-indigo-50",
  error,
  emptyMessage,
  delta,
  range,
}: RevenueKpiCardProps) {
  const hasError = !!error;
  const isEmpty = !hasError && !!emptyMessage;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 font-geist truncate">
            {hasError || isEmpty ? "—" : value}
          </p>

          {hasError ? (
            <p className="mt-1 text-[11px] text-red-500 truncate" title={error}>
              {error}
            </p>
          ) : (
            <>
              {isEmpty && (
                <p className="mt-1 text-[11px] text-gray-400 leading-snug">
                  {emptyMessage}
                </p>
              )}
              {delta && !isEmpty && (
                <p className="mt-1 text-[11px] font-medium flex items-center gap-1 text-gray-500">
                  <span
                    className={
                      delta.direction === "up"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }
                  >
                    {delta.direction === "up" ? "↑" : "↓"}{" "}
                    {delta.percent.toFixed(1)}%
                  </span>
                  <span className="text-gray-400">vs {delta.range}</span>
                </p>
              )}
              {range && (
                <p className="mt-1 text-[11px] text-gray-400 truncate">
                  {range}
                </p>
              )}
            </>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
