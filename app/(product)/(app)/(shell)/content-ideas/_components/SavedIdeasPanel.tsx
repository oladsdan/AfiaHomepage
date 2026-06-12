"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  ChevronRight,
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
import type { ContentIdea } from "@/lib/web/ai/types";

function SavedIdeaRow({
  item,
  onOpen,
}: {
  item: SavedIdea;
  onOpen: (idea: ContentIdea) => void;
}) {
  const queryClient = useQueryClient();

  const remove = useAiMutation<void, void>({
    mutationFn: () => deleteSavedIdea(item.id),
    onSuccess: () => {
      toast("Idea deleted", "success");
      void queryClient.invalidateQueries({ queryKey: SAVED_IDEAS_QUERY_KEY });
    },
  });

  return (
    <li className="flex items-center gap-2 rounded-dash border border-dash-border bg-dash-surface p-3 shadow-dash">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-dash-ink">
            {item.title}
          </p>
          {item.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-dash-muted">
              {item.description}
            </p>
          )}
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-dash-muted"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        onClick={() => remove.mutate()}
        disabled={remove.isPending}
        aria-label={`Delete ${item.title}`}
        className="shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
      >
        {remove.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </li>
  );
}

/**
 * Controlled saved-ideas slide-over. Lists the user's saved ideas; selecting
 * one calls onOpenIdea (the orchestrator opens it in the breakdown view).
 */
export function SavedIdeasPanel({
  open,
  onClose,
  onOpenIdea,
}: {
  open: boolean;
  onClose: () => void;
  onOpenIdea: (idea: ContentIdea) => void;
}) {
  const savedQuery = useQuery({
    queryKey: SAVED_IDEAS_QUERY_KEY,
    queryFn: listSavedIdeas,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return undefined;
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
  }, [open, onClose]);

  if (!open) return null;

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
            Saved Ideas
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
                  Bookmark ideas from the breakdown screen to find them here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <SavedIdeaRow key={item.id} item={item} onOpen={onOpenIdea} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
