"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import {
  deleteSavedIdea,
  listSavedIdeas,
  SAVED_IDEAS_QUERY_KEY,
  type SavedIdea,
} from "@/lib/web/ai/ideas-api";
import {
  CopyIdeaButton,
  IdeaBody,
  ideaActionButtonClasses,
} from "./IdeaView";

function SavedIdeaItem({ item }: { item: SavedIdea }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);

  const remove = useAiMutation<void, void>({
    mutationFn: () => deleteSavedIdea(item.id),
    onSuccess: () => {
      toast("Idea deleted", "success");
      void queryClient.invalidateQueries({ queryKey: SAVED_IDEAS_QUERY_KEY });
    },
  });

  const savedDate =
    typeof item.createdAt === "string" ? new Date(item.createdAt) : null;

  return (
    <li className="rounded-dash border border-dash-border bg-dash-surface p-4 shadow-dash">
      <p className="text-sm font-semibold text-dash-ink">{item.title}</p>
      {item.description && !expanded && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-dash-muted">
          {item.description}
        </p>
      )}
      {savedDate && !Number.isNaN(savedDate.getTime()) && (
        <p className="mt-2 text-xs text-dash-muted">
          {savedDate.toLocaleDateString()}
        </p>
      )}

      {expanded && (
        <div className="mt-3 border-t border-dash-border pt-3">
          <IdeaBody idea={item} />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Hide full idea" : "View full idea"}
          className={cn(
            ideaActionButtonClasses,
            expanded && "border-dash-brand text-dash-brand",
          )}
        >
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {expanded ? "Hide" : "View"}
        </button>
        <CopyIdeaButton idea={item} ariaLabel="Copy saved idea to clipboard" />
        <button
          type="button"
          onClick={() => remove.mutate()}
          disabled={remove.isPending}
          aria-label="Delete saved idea"
          className={cn(ideaActionButtonClasses, "text-red-600 hover:bg-red-50")}
        >
          {remove.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Delete
        </button>
      </div>
    </li>
  );
}

function SavedIdeasSlideOver({ onClose }: { onClose: () => void }) {
  const savedQuery = useQuery({
    queryKey: SAVED_IDEAS_QUERY_KEY,
    queryFn: listSavedIdeas,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const items = savedQuery.data ?? [];

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label="Saved ideas"
    >
      <button
        type="button"
        aria-label="Close saved ideas"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
      />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-dash-border bg-dash-bg shadow-dash-md">
        <div className="flex items-center justify-between border-b border-dash-border bg-dash-surface px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-dash-ink">
            <Bookmark className="h-4 w-4 text-dash-brand" aria-hidden="true" />
            Saved ideas
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-dash-muted transition-colors hover:bg-dash-bg hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {savedQuery.isPending ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-center gap-2 py-12 text-sm text-dash-muted"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading saved ideas…
            </div>
          ) : savedQuery.isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-dash-ink">
                {savedQuery.error instanceof Error && savedQuery.error.message
                  ? savedQuery.error.message
                  : "Couldn't load your saved ideas."}
              </p>
              <button
                type="button"
                onClick={() => void savedQuery.refetch()}
                className="mt-3 rounded-lg bg-dash-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dash-brand/10 text-dash-brand">
                <Bookmark className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-dash-ink">
                  No saved ideas yet
                </p>
                <p className="mt-1 text-xs text-dash-muted">
                  Generate ideas and hit Save to keep your favourites here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <SavedIdeaItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function SavedIdeasPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
      >
        <Bookmark className="h-4 w-4" aria-hidden="true" />
        Saved ideas
      </button>
      {open && <SavedIdeasSlideOver onClose={() => setOpen(false)} />}
    </>
  );
}
