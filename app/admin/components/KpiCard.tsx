import { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg?: string;
  error?: string;
}

export function KpiCard({
  label,
  value,
  icon,
  iconBg = "bg-[#0FA37F]/10",
  error,
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 font-geist truncate">
            {error ? "—" : value}
          </p>
          {error && (
            <p className="mt-1 text-[11px] text-red-500 truncate" title={error}>
              {error}
            </p>
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
