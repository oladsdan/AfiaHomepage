"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Check,
  Copy,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import {
  deleteSavedCaption,
  listSavedCaptions,
  SAVED_CAPTIONS_QUERY_KEY,
  savedCaptionText,
  updateSavedCaption,
} from "@/lib/web/ai/captions-api";
import type { SavedCaption } from "@/lib/web/ai/types";
import {
  platforms,
  captionStyles,
  audiences,
} from "@/lib/web/caption-generator-data";

const actionButtonClasses =
  "inline-flex items-center gap-1.5 rounded-lg border border-dash-border bg-dash-surface px-2.5 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

function labelFor(
  options: ReadonlyArray<{ id: string; label: string }>,
  id: string | undefined,
): string | null {
  if (!id) return null;
  const match = options.filter((o) => o.id === id)[0];
  return match ? match.label : id;
}

function metaLine(item: SavedCaption): string {
  const parts: string[] = [];
  if (Array.isArray(item.platforms)) {
    item.platforms.forEach((p) => {
      const label = labelFor(platforms, typeof p === "string" ? p : undefined);
      if (label) parts.push(label);
    });
  }
  const styleLabel = labelFor(
    captionStyles,
    typeof item.style === "string" ? item.style : undefined,
  );
  if (styleLabel) parts.push(styleLabel);
  const audienceLabel = labelFor(
    audiences,
    typeof item.audience === "string" ? item.audience : undefined,
  );
  if (audienceLabel) parts.push(audienceLabel);
  if (typeof item.createdAt === "string") {
    const date = new Date(item.createdAt);
    if (!Number.isNaN(date.getTime())) {
      parts.push(date.toLocaleDateString());
    }
  }
  return parts.join(" · ");
}

function SavedCaptionItem({ item }: { item: SavedCaption }) {
  const queryClient = useQueryClient();
  const text = savedCaptionText(item);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: SAVED_CAPTIONS_QUERY_KEY });

  const update = useAiMutation<void, string>({
    mutationFn: (newText) => {
      // Update whichever field the server stored the caption text under.
      const field =
        item.text === undefined && typeof item.caption === "string"
          ? "caption"
          : "text";
      return updateSavedCaption(item.id, { [field]: newText });
    },
    onSuccess: () => {
      toast("Caption updated", "success");
      setEditing(false);
      invalidate();
    },
  });

  const remove = useAiMutation<void, void>({
    mutationFn: () => deleteSavedCaption(item.id),
    onSuccess: () => {
      toast("Caption deleted", "success");
      invalidate();
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast("Copied to clipboard", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const meta = metaLine(item);

  return (
    <li className="rounded-dash border border-dash-border bg-dash-surface p-4 shadow-dash">
      {editing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            aria-label="Edit saved caption"
            disabled={update.isPending}
            className="w-full resize-none rounded-dash border border-dash-border bg-dash-bg p-3 text-sm text-dash-ink focus:border-dash-brand focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40 disabled:opacity-60"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const value = draft.trim();
                if (!value || update.isPending) return;
                update.mutate(value);
              }}
              disabled={!draft.trim() || update.isPending}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2",
                !draft.trim() || update.isPending
                  ? "cursor-not-allowed bg-dash-border text-dash-muted"
                  : "bg-dash-brand hover:bg-dash-brand-dark",
              )}
            >
              {update.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              )}
              {update.isPending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setDraft(text);
              }}
              disabled={update.isPending}
              className={actionButtonClasses}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-dash-ink">
            {text}
          </p>
          {meta && <p className="mt-2 text-xs text-dash-muted">{meta}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy saved caption to clipboard"
              className={actionButtonClasses}
            >
              {copied ? (
                <Check
                  className="h-3.5 w-3.5 text-dash-brand"
                  aria-hidden="true"
                />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(text);
                setEditing(true);
              }}
              aria-label="Edit saved caption"
              className={actionButtonClasses}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => remove.mutate()}
              disabled={remove.isPending}
              aria-label="Delete saved caption"
              className={cn(
                actionButtonClasses,
                "text-red-600 hover:bg-red-50",
              )}
            >
              {remove.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

function SavedCaptionsSlideOver({ onClose }: { onClose: () => void }) {
  const savedQuery = useQuery({
    queryKey: SAVED_CAPTIONS_QUERY_KEY,
    queryFn: listSavedCaptions,
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
      aria-label="Saved captions"
    >
      <button
        type="button"
        aria-label="Close saved captions"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
      />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-dash-border bg-dash-bg shadow-dash-md">
        <div className="flex items-center justify-between border-b border-dash-border bg-dash-surface px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-dash-ink">
            <Bookmark className="h-4 w-4 text-dash-brand" aria-hidden="true" />
            Saved captions
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
              Loading saved captions…
            </div>
          ) : savedQuery.isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-dash-ink">
                {savedQuery.error instanceof Error && savedQuery.error.message
                  ? savedQuery.error.message
                  : "Couldn't load your saved captions."}
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
                  No saved captions yet
                </p>
                <p className="mt-1 text-xs text-dash-muted">
                  Generate captions and hit Save to keep your favourites here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <SavedCaptionItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function SavedCaptionsPanel() {
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
        Saved templates
      </button>
      {open && <SavedCaptionsSlideOver onClose={() => setOpen(false)} />}
    </>
  );
}
