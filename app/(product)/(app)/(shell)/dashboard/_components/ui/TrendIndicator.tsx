import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { TrendData } from "@/lib/web/dashboard-types";
import { cn } from "@/lib/utils";

export function TrendIndicator({ trend }: { trend: TrendData }) {
  const up = trend.direction === "up";
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        up ? "text-dash-positive" : "text-red-500",
      )}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>
        {up ? "+" : "−"}
        {trend.percent}
      </span>
      <span className="sr-only">
        {up ? "increased" : "decreased"} by {trend.percent}
      </span>
    </span>
  );
}
