"use client";

import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

export function AiConsentModal({
  open,
  serverMessage,
  busy,
  onAccept,
  onCancel,
}: {
  open: boolean;
  serverMessage?: string;
  busy: boolean;
  onAccept: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-consent-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={busy ? undefined : onCancel}
      />
      <div className="relative w-full max-w-md rounded-dash-lg border border-dash-border bg-dash-surface p-6 shadow-dash-md">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dash-brand/10 text-dash-brand">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </span>

        <h2
          id="ai-consent-title"
          className="mt-4 text-lg font-bold text-dash-ink"
        >
          Turn on AI features
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-dash-muted">
          {serverMessage ||
            "Afia uses OpenAI to power AI features. Content you submit (like video details, descriptions, and messages) is shared with OpenAI to generate your results."}
        </p>

        <div className="mt-4 flex items-start gap-2.5 rounded-dash bg-dash-bg p-3">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-dash-brand"
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed text-dash-muted">
            You can withdraw consent at any time in Settings. Without it, AI
            features stay off — everything else keeps working.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-dash border border-dash-border bg-dash-surface px-4 py-2.5 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-dash bg-dash-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {busy ? "Saving…" : "Agree and continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
