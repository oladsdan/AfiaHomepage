"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SelectableTile({
  selected,
  onSelect,
  ariaLabel,
  className,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      onClick={onSelect}
      className={cn(
        "relative flex items-center justify-center rounded-dash border bg-dash-surface text-center transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2",
        selected
          ? "border-dash-brand ring-1 ring-dash-brand shadow-dash"
          : "border-dash-border hover:border-dash-brand/40 hover:shadow-dash",
        className,
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-dash-brand text-white">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
        </span>
      )}
      {children}
    </button>
  );
}
