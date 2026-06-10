"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eraser,
  Loader2,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import {
  clearConversation,
  CONVERSATIONS_QUERY_KEY,
  deleteConversation,
  listConversations,
} from "@/lib/web/ai/coach-api";
import type { CoachConversation } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

/** Relative-ish time from updatedAt; falls back gracefully. */
function relativeTime(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  const ms = date.getTime();
  if (Number.isNaN(ms)) return null;

  const diff = Date.now() - ms;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) {
    const mins = Math.round(diff / minute);
    return `${mins}m ago`;
  }
  if (diff < day) {
    const hours = Math.round(diff / hour);
    return `${hours}h ago`;
  }
  if (diff < 7 * day) {
    const days = Math.round(diff / day);
    return days === 1 ? "Yesterday" : `${days}d ago`;
  }
  return date.toLocaleDateString();
}

function ConversationItem({
  conversation,
  isActive,
  onOpen,
  onDeleted,
  onCleared,
}: {
  conversation: CoachConversation;
  isActive: boolean;
  onOpen: (id: string) => void;
  onDeleted: (id: string) => void;
  onCleared: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const remove = useAiMutation<void, void>({
    mutationFn: () => deleteConversation(conversation.id),
    onSuccess: () => {
      toast("Conversation deleted", "success");
      setConfirmingDelete(false);
      void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
      onDeleted(conversation.id);
    },
    onError: () => setConfirmingDelete(false),
  });

  const clear = useAiMutation<void, void>({
    mutationFn: () => clearConversation(conversation.id),
    onSuccess: () => {
      toast("Conversation cleared", "success");
      void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
      onCleared(conversation.id);
    },
  });

  const busy = remove.isPending || clear.isPending;
  const time = relativeTime(conversation.updatedAt ?? conversation.createdAt);
  const title = conversation.title?.trim() || "Untitled chat";

  return (
    <li
      className={cn(
        "group relative rounded-lg transition-colors",
        isActive ? "bg-dash-brand/10" : "hover:bg-dash-bg",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(conversation.id)}
        aria-current={isActive ? "true" : undefined}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
      >
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full",
            isActive
              ? "bg-dash-brand/20 text-dash-brand"
              : "bg-dash-bg text-dash-muted",
          )}
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-sm",
              isActive ? "font-semibold text-dash-ink" : "text-dash-ink",
            )}
          >
            {title}
          </span>
          {time && (
            <span className="block text-xs text-dash-muted">{time}</span>
          )}
        </span>
      </button>

      {/* Hover / focus actions */}
      <div
        className={cn(
          "absolute right-1.5 top-1.5 flex items-center gap-0.5 transition-opacity",
          "opacity-0 focus-within:opacity-100 group-hover:opacity-100",
          (confirmingDelete || busy) && "opacity-100",
        )}
      >
        {confirmingDelete ? (
          <>
            <button
              type="button"
              onClick={() => remove.mutate()}
              disabled={busy}
              aria-label="Confirm delete conversation"
              className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60"
            >
              {remove.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-3 w-3" aria-hidden="true" />
              )}
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={remove.isPending}
              aria-label="Cancel delete"
              className="grid h-6 w-6 place-items-center rounded-md text-dash-muted transition-colors hover:bg-dash-bg hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => clear.mutate()}
              disabled={busy}
              aria-label={`Clear messages in ${title}`}
              title="Clear messages"
              className="grid h-6 w-6 place-items-center rounded-md text-dash-muted transition-colors hover:bg-white hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand disabled:opacity-60"
            >
              {clear.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={busy}
              aria-label={`Delete ${title}`}
              title="Delete conversation"
              className="grid h-6 w-6 place-items-center rounded-md text-dash-muted transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export function ConversationsCard({
  activeId,
  onOpen,
  onDeleted,
  onCleared,
}: {
  activeId: string | null;
  onOpen: (id: string) => void;
  onDeleted: (id: string) => void;
  onCleared: (id: string) => void;
}) {
  const conversationsQuery = useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: listConversations,
  });

  const items = (conversationsQuery.data ?? []).slice(0, 8);

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-dash-ink">
        Recent conversations
      </h2>

      <div className="mt-4">
        {conversationsQuery.isPending ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center gap-2 py-6 text-sm text-dash-muted"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading…
          </div>
        ) : conversationsQuery.isError ? (
          <div className="py-4 text-center">
            <p className="text-xs text-dash-muted">
              {conversationsQuery.error instanceof Error &&
              conversationsQuery.error.message
                ? conversationsQuery.error.message
                : "Couldn't load your conversations."}
            </p>
            <button
              type="button"
              onClick={() => void conversationsQuery.refetch()}
              className="mt-2 text-xs font-medium text-dash-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-xs text-dash-muted">
            No conversations yet
          </p>
        ) : (
          <ul className="space-y-1">
            {items.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeId}
                onOpen={onOpen}
                onDeleted={onDeleted}
                onCleared={onCleared}
              />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
