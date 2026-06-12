"use client";

import { ArrowLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import type { ContentIdea } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

/** "Your Ideas Are Ready" — compact list; tap a card to open its breakdown. */
export function IdeaResultsList({
  ideas,
  refreshing,
  onOpen,
  onRefresh,
  onBack,
}: {
  ideas: ContentIdea[];
  refreshing: boolean;
  onOpen: (idea: ContentIdea) => void;
  onRefresh: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-dash-muted transition-colors hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Edit inputs
      </button>

      <div>
        <h1 className="text-2xl font-bold text-dash-ink">Your Ideas Are Ready</h1>
        <p className="mt-1 text-sm text-dash-muted">
          Fresh ideas designed to engage your audience and boost performance.
        </p>
      </div>

      {ideas.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-dash-muted">
            No ideas came back this time. Try generating again.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <button
              key={idea.id ?? `idea-${i}`}
              type="button"
              onClick={() => onOpen(idea)}
              className="flex w-full items-center gap-3 rounded-dash border border-dash-border bg-dash-surface p-4 text-left shadow-dash transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
            >
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-dash-ink">
                  {idea.title}
                </p>
                {idea.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-dash-muted">
                    {idea.description}
                  </p>
                )}
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dash-bg text-dash-muted">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="flex w-full items-center justify-center gap-2 rounded-dash bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-dash-md transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {refreshing ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        )}
        Refresh more
      </button>
    </div>
  );
}
