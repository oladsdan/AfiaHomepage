"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";

/**
 * "Generating Content Ideas" screen — the web counterpart of the mobile
 * CraftingIdeas screen. Animates a fake progress bar up to ~92% while the
 * request is in flight (the orchestrator swaps to results on success).
 */
export function CraftingIdeas({ onCancel }: { onCancel?: () => void }) {
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? prev : Math.min(92, prev + 0.5)));
    }, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Generating content ideas"
      aria-live="polite"
      className="relative overflow-hidden rounded-dash-lg bg-gradient-to-br from-dash-hero-from via-dash-hero-via to-dash-hero-to px-6 py-12 text-center shadow-dash-md sm:px-10 sm:py-16"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 animate-pulse rounded-full bg-white/10 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 animate-pulse rounded-full bg-dash-brand/20 blur-3xl"
        style={{ animationDelay: "1s" }}
      />

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <span className="flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-white/15">
          <Image src="/afia-icon.png" alt="" width={48} height={48} className="h-12 w-12" />
        </span>

        <h2 className="mt-6 text-xl font-bold text-white sm:text-2xl">
          Generating Content Ideas
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Analyzing trends, audience behavior, and content gaps.
        </p>

        <div className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-white/15 px-5 py-4 shadow-dash-md">
          <Sparkles className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
          <span className="ai-shimmer flex-1 text-left text-sm font-medium">
            Crafting unique ideas…
          </span>
          <span className="text-sm font-semibold tabular-nums text-white">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
