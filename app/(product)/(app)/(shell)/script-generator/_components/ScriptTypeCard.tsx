"use client";

import { cn } from "@/lib/utils";
import type { ScriptTypeOption } from "@/lib/web/script-generator-data";

export function ScriptTypeCard({
  option,
  selected,
  onSelect,
}: {
  option: ScriptTypeOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={option.title}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-dash border bg-dash-surface p-4 text-left transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2",
        selected
          ? "border-dash-brand ring-1 ring-dash-brand shadow-dash"
          : "border-dash-border hover:border-dash-brand/40 hover:shadow-dash",
      )}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: option.bg, color: option.color }}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-dash-ink">
          {option.title}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-dash-muted">
          {option.description}
        </span>
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-dash-brand" : "border-dash-border",
        )}
        aria-hidden="true"
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-dash-brand" />}
      </span>
    </button>
  );
}
