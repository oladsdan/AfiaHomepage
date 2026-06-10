import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable "AI generating…" state shown while an AI call is in flight.
 */
export function AiGenerating({
  label = "Afia is thinking…",
  sublabel,
  className,
}: {
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-dash-lg border border-dash-border bg-dash-surface px-6 py-10 text-center shadow-dash",
        className,
      )}
    >
      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-dash-brand/10 text-dash-brand">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        <Loader2
          className="absolute -bottom-1 -right-1 h-5 w-5 animate-spin rounded-full bg-dash-surface p-0.5 text-dash-brand"
          aria-hidden="true"
        />
      </span>
      <div>
        <p className="text-sm font-semibold text-dash-ink">{label}</p>
        {sublabel && (
          <p className="mt-1 text-xs text-dash-muted">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
