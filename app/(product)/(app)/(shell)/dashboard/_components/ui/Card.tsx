import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-dash-surface border border-dash-border rounded-dash shadow-dash",
        className,
      )}
    >
      {children}
    </div>
  );
}
