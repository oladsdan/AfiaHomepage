import { aiFetch } from "./client";
import type { CoachConversation, CoachMessage, CoachReply } from "./types";

/**
 * AI Coach endpoints (02-ai-tools.md, Prompt 11).
 * Credits are charged/refunded SERVER-side — the client only triggers calls.
 *  - POST /api/coach/message charges 1 credit.
 *  - POST /api/coach/transcribe is free but still consent-gated.
 */

/** Query key for the conversations list (mirrors the GET path). */
export const CONVERSATIONS_QUERY_KEY = ["/api/coach/conversations"] as const;

// ---------------------------------------------------------------------------
// Send a message (1 credit, server-side)
// ---------------------------------------------------------------------------

export interface CoachSendInput {
  message: string;
  /** Omit to start a new thread; the reply returns the new conversationId. */
  conversationId?: string;
}

export async function sendMessage(input: CoachSendInput): Promise<CoachReply> {
  const payload: Record<string, unknown> = { message: input.message };
  if (input.conversationId) payload.conversationId = input.conversationId;

  const body = await aiFetch<{ success?: boolean; data?: Partial<CoachReply> }>(
    "/api/coach/message",
    { method: "POST", body: payload },
  );

  const data = body.data ?? {};
  return {
    conversationId:
      typeof data.conversationId === "string"
        ? data.conversationId
        : input.conversationId ?? "",
    reply: typeof data.reply === "string" ? data.reply : "",
    title: typeof data.title === "string" ? data.title : undefined,
  };
}

// ---------------------------------------------------------------------------
// Voice transcription (free, consent-gated, multipart)
// ---------------------------------------------------------------------------

export async function transcribeAudio(blob: Blob): Promise<string> {
  const fd = new FormData();
  // The api layer lets the browser set the multipart boundary for FormData —
  // never set Content-Type here.
  fd.append("audio", blob, "recording.webm");

  const body = await aiFetch<{ success?: boolean; text?: string }>(
    "/api/coach/transcribe",
    { method: "POST", body: fd },
  );

  return typeof body.text === "string" ? body.text : "";
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

function normalizeConversation(
  item: Record<string, unknown>,
  index: number,
): CoachConversation {
  const rawId = item.id ?? item._id ?? item.conversationId;
  return {
    ...item,
    id:
      rawId !== undefined && rawId !== null
        ? String(rawId)
        : `conversation-${index}`,
    title: typeof item.title === "string" ? item.title : undefined,
  } as CoachConversation;
}

/** GET /api/coach/conversations — list shape may vary; normalize defensively. */
export async function listConversations(): Promise<CoachConversation[]> {
  const body = await aiFetch<unknown>("/api/coach/conversations");

  let list: unknown = body;
  if (list && typeof list === "object" && !Array.isArray(list)) {
    const obj = list as Record<string, unknown>;
    list = obj.data ?? obj.conversations ?? obj.items ?? [];
    if (list && typeof list === "object" && !Array.isArray(list)) {
      const inner = list as Record<string, unknown>;
      list = inner.conversations ?? inner.items ?? [];
    }
  }
  if (!Array.isArray(list)) return [];

  return list
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object",
    )
    .map(normalizeConversation);
}

/** Returns the message body text regardless of which field the server used. */
export function coachMessageText(item: CoachMessage): string {
  if (typeof item.content === "string") return item.content;
  if (typeof item.message === "string") return item.message;
  if (typeof item.text === "string") return item.text;
  return "";
}

function normalizeMessage(
  item: Record<string, unknown>,
  index: number,
): CoachMessage {
  const rawId = item.id ?? item._id;
  const rawRole = item.role;
  const role =
    rawRole === "assistant" || rawRole === "user"
      ? rawRole
      : typeof rawRole === "string"
        ? rawRole
        : "assistant";
  return {
    ...item,
    id:
      rawId !== undefined && rawId !== null ? String(rawId) : `message-${index}`,
    role,
  } as CoachMessage;
}

/** GET /api/coach/conversations/:id/messages — defensive normalization. */
export async function getMessages(id: string): Promise<CoachMessage[]> {
  const body = await aiFetch<unknown>(
    `/api/coach/conversations/${encodeURIComponent(id)}/messages`,
  );

  let list: unknown = body;
  if (list && typeof list === "object" && !Array.isArray(list)) {
    const obj = list as Record<string, unknown>;
    list = obj.data ?? obj.messages ?? obj.items ?? [];
    if (list && typeof list === "object" && !Array.isArray(list)) {
      const inner = list as Record<string, unknown>;
      list = inner.messages ?? inner.items ?? [];
    }
  }
  if (!Array.isArray(list)) return [];

  return list
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object",
    )
    .map(normalizeMessage);
}

export async function deleteConversation(id: string): Promise<void> {
  await aiFetch<{ success?: boolean }>(
    `/api/coach/conversations/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}

export async function clearConversation(id: string): Promise<void> {
  await aiFetch<{ success?: boolean }>(
    `/api/coach/conversations/${encodeURIComponent(id)}/clear`,
    { method: "POST" },
  );
}
