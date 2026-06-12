"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Loader2,
  Sparkles,
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

export interface IdeaHooksContext {
  videoType: string;
  platforms: string[];
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((point, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-dash-muted">
          <span aria-hidden="true" className="text-dash-muted">
            •
          </span>
          <span className="flex-1">{point}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Full idea breakdown (mirrors the mobile IdeaBreakdown): title + description,
 * a collapsible Hook Suggestion section (copy each, Generate More Hooks which
 * REPLACES the list), Concept Description (video structure + why this works),
 * and Create My Script / Save Idea actions.
 */
export function IdeaBreakdown({
  idea,
  hooksContext,
  alreadySaved = false,
  onBack,
}: {
  idea: ContentIdea;
  hooksContext: IdeaHooksContext;
  alreadySaved?: boolean;
  onBack: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [hooks, setHooks] = useState<string[]>(idea.hooks ?? []);
  const [hooksOpen, setHooksOpen] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(alreadySaved);

  const structure = idea.videoStructure ?? [];
  const why = idea.whyThisWorks ?? [];

  const moreHooks = useAiMutation<string[], HooksGenerateInput>({
    mutationFn: generateHooks,
    onSuccess: (next) => {
      if (next.length === 0) {
        toast("No new hooks came back. Try again.");
        return;
      }
      // Mobile REPLACES the hook list with the fresh set.
      setHooks(next);
    },
  });

  const save = useAiMutation<void, void>({
    mutationFn: () => saveIdea({ ...idea, hooks }),
    onSuccess: () => {
      setSaved(true);
      toast("Idea added to your bookmarks.", "success");
      void queryClient.invalidateQueries({ queryKey: SAVED_IDEAS_QUERY_KEY });
    },
  });

  const copyHook = (hook: string, index: number) => {
    navigator.clipboard.writeText(hook).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((cur) => (cur === index ? null : cur)), 1500);
    });
  };

  const handleCreateScript = () => {
    const topic = idea.description
      ? `${idea.title} — ${idea.description}`
      : idea.title;
    router.push(`/script-generator?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-dash-muted transition-colors hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to ideas
      </button>

      {/* Title + description */}
      <div>
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-dash-brand" aria-hidden="true" />
          <h1 className="text-xl font-bold text-dash-brand sm:text-2xl">
            {idea.title}
          </h1>
        </div>
        {idea.description && (
          <p className="mt-2 text-sm leading-relaxed text-dash-muted">
            {idea.description}
          </p>
        )}
      </div>

      {/* Hook suggestions */}
      {hooks.length > 0 && (
        <Card className="p-5">
          <button
            type="button"
            onClick={() => setHooksOpen((v) => !v)}
            aria-expanded={hooksOpen}
            className="flex w-full items-center justify-between gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
          >
            <span className="flex items-center gap-1.5 text-base font-semibold text-fuchsia-600">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Hook Suggestion
            </span>
            {hooksOpen ? (
              <ChevronUp className="h-5 w-5 text-dash-brand" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-5 w-5 text-dash-brand" aria-hidden="true" />
            )}
          </button>

          {hooksOpen && (
            <div className="mt-4 space-y-2">
              {hooks.map((hook, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-dash bg-dash-bg px-3 py-3"
                >
                  <p className="flex-1 text-sm leading-relaxed text-dash-ink">
                    {hook}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyHook(hook, index)}
                    aria-label={copiedIndex === index ? "Copied" : "Copy hook"}
                    className="shrink-0 rounded-lg p-1.5 text-dash-muted transition-colors hover:bg-dash-surface hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-dash-brand" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  moreHooks.mutate({
                    ideaTitle: idea.title,
                    ideaDescription: idea.description ?? "",
                    videoType: hooksContext.videoType,
                    platforms: hooksContext.platforms,
                  })
                }
                disabled={moreHooks.isPending}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-dash bg-gradient-to-r from-fuchsia-600 to-dash-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {moreHooks.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                )}
                {moreHooks.isPending ? "Generating…" : "Generate More Hooks"}
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Concept description */}
      {(structure.length > 0 || why.length > 0) && (
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-base font-semibold text-fuchsia-600">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Concept Description
          </p>
          <Card className="space-y-5 p-5">
            {structure.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-dash-ink">Video Structure</h3>
                <div className="mt-2">
                  <BulletList items={structure} />
                </div>
              </div>
            )}
            {why.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-dash-ink">Why this works</h3>
                <div className="mt-2">
                  <BulletList items={why} />
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleCreateScript}
          className="flex w-full items-center justify-center gap-2 rounded-dash bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-dash-md transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Create My Script
        </button>
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending || saved}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-dash border-2 border-dash-brand bg-dash-surface px-6 py-3.5 text-sm font-semibold text-dash-brand transition-colors hover:bg-dash-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {save.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : saved ? (
            <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Bookmark className="h-4 w-4" aria-hidden="true" />
          )}
          {saved ? "Saved" : save.isPending ? "Saving…" : "Save Idea"}
        </button>
      </div>
    </div>
  );
}
