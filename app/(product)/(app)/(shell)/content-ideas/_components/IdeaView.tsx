"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Plus,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import {
  generateHooks,
  saveIdea,
  SAVED_IDEAS_QUERY_KEY,
} from "@/lib/web/ai/ideas-api";
import type {
  ContentIdea,
  HooksGenerateInput,
} from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

export const ideaActionButtonClasses =
  "inline-flex items-center gap-1.5 rounded-lg border border-dash-border bg-dash-surface px-3 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

/** Context needed to ask the server for more hooks for a given idea. */
export interface IdeaHooksContext {
  videoType: string;
  platforms: string[];
}

/** Format a whole idea as readable plain text for the clipboard. */
export function formatIdeaText(idea: ContentIdea): string {
  const lines: string[] = [];
  lines.push(idea.title);
  if (idea.description && idea.description.trim()) {
    lines.push("", idea.description.trim());
  }
  if (idea.hooks && idea.hooks.length > 0) {
    lines.push("", "Hooks:");
    idea.hooks.forEach((hook) => lines.push(`- ${hook}`));
  }
  if (idea.videoStructure && idea.videoStructure.length > 0) {
    lines.push("", "Video structure:");
    idea.videoStructure.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
  }
  if (idea.whyThisWorks && idea.whyThisWorks.length > 0) {
    lines.push("", "Why this works:");
    idea.whyThisWorks.forEach((why) => lines.push(`- ${why}`));
  }
  return lines.join("\n");
}

/** Copy button with a transient Check swap; copies the formatted idea. */
export function CopyIdeaButton({
  idea,
  ariaLabel = "Copy idea to clipboard",
}: {
  idea: ContentIdea;
  ariaLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatIdeaText(idea)).then(() => {
      toast("Copied to clipboard", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={ideaActionButtonClasses}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-dash-brand" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** The read-only body of an idea: hooks, structure, why-it-works. */
export function IdeaBody({ idea }: { idea: ContentIdea }) {
  const hooks = idea.hooks ?? [];
  const structure = idea.videoStructure ?? [];
  const why = idea.whyThisWorks ?? [];

  return (
    <div className="space-y-5">
      {idea.description && idea.description.trim() && (
        <p className="text-sm leading-relaxed text-dash-muted">
          {idea.description}
        </p>
      )}

      {hooks.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-dash-brand">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Hooks
          </p>
          <ul className="mt-2 space-y-2">
            {hooks.map((hook, i) => (
              <li
                key={`hook-${i}`}
                className="flex gap-2 text-sm leading-relaxed text-dash-ink"
              >
                <Zap
                  className="mt-0.5 h-4 w-4 shrink-0 text-dash-brand"
                  aria-hidden="true"
                />
                <span>{hook}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {structure.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
            Video structure
          </p>
          <ol className="mt-2 space-y-2">
            {structure.map((step, i) => (
              <li
                key={`step-${i}`}
                className="flex gap-3 text-sm leading-relaxed text-dash-ink"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dash-brand/10 text-xs font-semibold text-dash-brand">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {why.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
            Why this works
          </p>
          <ul className="mt-2 space-y-2">
            {why.map((reason, i) => (
              <li
                key={`why-${i}`}
                className="flex gap-2 text-sm leading-relaxed text-dash-ink"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-dash-positive"
                  aria-hidden="true"
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * A full idea card for the results list: title, body, and per-card actions
 * (More hooks → appends; Copy; Save). `hooksContext` drives the more-hooks call.
 */
export function IdeaResultCard({
  idea,
  hooksContext,
}: {
  idea: ContentIdea;
  hooksContext: IdeaHooksContext;
}) {
  const queryClient = useQueryClient();
  // Local copy so appended hooks (and saved state) reflect immediately.
  const [current, setCurrent] = useState<ContentIdea>(idea);

  const moreHooks = useAiMutation<string[], HooksGenerateInput>({
    mutationFn: generateHooks,
    onSuccess: (hooks) => {
      if (hooks.length === 0) {
        toast("No new hooks came back. Try again.");
        return;
      }
      setCurrent((prev) => ({
        ...prev,
        hooks: [...(prev.hooks ?? []), ...hooks],
      }));
    },
  });

  const save = useAiMutation<void, void>({
    mutationFn: () => saveIdea(current),
    onSuccess: () => {
      toast("Idea saved", "success");
      void queryClient.invalidateQueries({ queryKey: SAVED_IDEAS_QUERY_KEY });
    },
  });

  const handleMoreHooks = () => {
    if (moreHooks.isPending) return;
    moreHooks.mutate({
      ideaTitle: current.title,
      ideaDescription: current.description ?? "",
      videoType: hooksContext.videoType,
      platforms: hooksContext.platforms,
    });
  };

  return (
    <Card className="p-5">
      <h3 className="text-lg font-bold text-dash-ink">{current.title}</h3>

      <div className="mt-4">
        <IdeaBody idea={current} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dash-border pt-4">
        <button
          type="button"
          onClick={handleMoreHooks}
          disabled={moreHooks.isPending}
          aria-label="Generate more hooks for this idea"
          className={cn(
            ideaActionButtonClasses,
            "border-dash-brand/40 text-dash-brand hover:bg-dash-brand/5",
          )}
        >
          {moreHooks.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {moreHooks.isPending ? "Generating…" : "More hooks"}
        </button>

        <CopyIdeaButton idea={current} />

        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          aria-label="Save idea"
          className={ideaActionButtonClasses}
        >
          {save.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Save
        </button>
      </div>
    </Card>
  );
}
