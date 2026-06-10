"use client";

import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  FileText,
  Lightbulb,
  Loader2,
  Mic,
  Plus,
  Sparkles,
  Square,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import { AiError } from "@/lib/web/ai/client";
import {
  coachMessageText,
  CONVERSATIONS_QUERY_KEY,
  getMessages,
  sendMessage,
  transcribeAudio,
  type CoachSendInput,
} from "@/lib/web/ai/coach-api";
import type { CoachReply } from "@/lib/web/ai/types";
import { Card } from "../dashboard/_components/ui/Card";
import { ChatThread } from "./_components/ChatThread";
import { ConversationsCard } from "./_components/ConversationsCard";
import type { ChatMessage } from "./_components/chatTypes";
import { useVoiceRecorder } from "./_components/useVoiceRecorder";

const samplePrompts = [
  "How can I improve my video retention?",
  "Give me ideas for hooks",
  "What makes a viral video?",
  "Analyze my video performance",
];

const helpItems = [
  {
    icon: BarChart3,
    bg: "bg-blue-100",
    fg: "text-blue-600",
    title: "Improve performance",
    desc: "Get tips to boost views and engagement",
  },
  {
    icon: Lightbulb,
    bg: "bg-purple-100",
    fg: "text-purple-600",
    title: "Content ideas",
    desc: "Discover trending ideas and creative hooks",
  },
  {
    icon: FileText,
    bg: "bg-orange-100",
    fg: "text-orange-600",
    title: "Video optimization",
    desc: "Get advice on titles, captions and more",
  },
  {
    icon: Users,
    bg: "bg-pink-100",
    fg: "text-pink-600",
    title: "Audience insights",
    desc: "Understand your audience and grow faster",
  },
];

let localIdCounter = 0;
function nextLocalId(prefix: string): string {
  localIdCounter += 1;
  return `${prefix}-${Date.now()}-${localIdCounter}`;
}

export default function AiChatPage() {
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  // conversationId at send-time may be a fresh thread; track via ref so the
  // mutation always reads the latest value.
  const conversationIdRef = useRef<string | null>(null);
  conversationIdRef.current = conversationId;

  const hasThread = messages.length > 0;

  // -------------------------------------------------------------------------
  // Send a message
  // -------------------------------------------------------------------------

  const send = useAiMutation<
    CoachReply,
    { input: CoachSendInput; localId: string }
  >({
    mutationFn: ({ input }) => sendMessage(input),
    onSuccess: (reply, variables) => {
      const wasNewThread = !conversationIdRef.current;
      if (reply.conversationId) {
        setConversationId(reply.conversationId);
        conversationIdRef.current = reply.conversationId;
      }
      // Mark the user message as delivered.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === variables.localId ? { ...m, status: undefined } : m,
        ),
      );
      if (reply.reply.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextLocalId("assistant"),
            role: "assistant",
            content: reply.reply,
          },
        ]);
      }
      // First reply of a new thread → the auto-titled thread now exists.
      if (wasNewThread) {
        void queryClient.invalidateQueries({
          queryKey: CONVERSATIONS_QUERY_KEY,
        });
      }
    },
    onError: (_error, variables) => {
      // Keep the user message visible with a retry affordance. useAiMutation
      // already toasted the server message (unless a gate handled it).
      setMessages((prev) =>
        prev.map((m) =>
          m.id === variables.localId ? { ...m, status: "failed" } : m,
        ),
      );
    },
  });

  const dispatchSend = useCallback(
    (text: string, localId: string) => {
      const input: CoachSendInput = { message: text };
      const currentId = conversationIdRef.current;
      if (currentId) input.conversationId = currentId;
      send.mutate({ input, localId });
    },
    [send],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || send.isPending) return;

    const localId = nextLocalId("user");
    setMessages((prev) => [
      ...prev,
      { id: localId, role: "user", content: text, status: "sending" },
    ]);
    setValue("");
    dispatchSend(text, localId);
  };

  const handleRetry = useCallback(
    (message: ChatMessage) => {
      if (send.isPending) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, status: "sending" } : m,
        ),
      );
      dispatchSend(message.content, message.id);
    },
    [dispatchSend, send.isPending],
  );

  // -------------------------------------------------------------------------
  // New chat / open existing thread
  // -------------------------------------------------------------------------

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    conversationIdRef.current = null;
    setValue("");
    inputRef.current?.focus();
  }, []);

  const [openingId, setOpeningId] = useState<string | null>(null);
  const openConversation = useCallback(
    async (id: string) => {
      if (id === conversationIdRef.current && messages.length > 0) return;
      setOpeningId(id);
      try {
        const loaded = await getMessages(id);
        const mapped: ChatMessage[] = loaded
          .map((m, index) => {
            const role = m.role === "user" ? "user" : "assistant";
            return {
              id: m.id ?? nextLocalId(`history-${index}`),
              role: role as "user" | "assistant",
              content: coachMessageText(m),
            };
          })
          .filter((m) => m.content.trim().length > 0);
        setMessages(mapped);
        setConversationId(id);
        conversationIdRef.current = id;
      } catch (error) {
        toast(
          error instanceof Error && error.message
            ? error.message
            : "Couldn't load that conversation.",
          "error",
        );
      } finally {
        setOpeningId(null);
      }
    },
    [messages.length],
  );

  const handleConversationDeleted = useCallback(
    (id: string) => {
      if (id === conversationIdRef.current) handleNewChat();
    },
    [handleNewChat],
  );

  const handleConversationCleared = useCallback(
    (id: string) => {
      if (id === conversationIdRef.current) setMessages([]);
    },
    [],
  );

  // -------------------------------------------------------------------------
  // Voice input
  // -------------------------------------------------------------------------

  const handleBlob = useCallback(async (blob: Blob) => {
    setTranscribing(true);
    try {
      const text = (await transcribeAudio(blob)).trim();
      if (text) {
        setValue((prev) => (prev ? `${prev} ${text}` : text));
        inputRef.current?.focus();
      } else {
        toast("Couldn't hear anything. Please try again.", "error");
      }
    } catch (error) {
      if (!(error instanceof AiError && error.handled)) {
        toast(
          error instanceof Error && error.message
            ? error.message
            : "Couldn't transcribe your recording. Please try again.",
          "error",
        );
      }
    } finally {
      setTranscribing(false);
    }
  }, []);

  const recorder = useVoiceRecorder(handleBlob);

  const handleMicClick = () => {
    if (transcribing) return;
    if (recorder.isRecording) {
      recorder.stop();
    } else if (recorder.supported) {
      void recorder.start();
    } else {
      toast(
        "Voice input isn't supported in this browser.",
        "warning",
      );
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const sendDisabled = !value.trim() || send.isPending;
  const isOpeningCurrent = openingId !== null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <section className="flex min-h-[26rem] flex-col lg:sticky lg:top-6 lg:h-[calc(100vh-7rem)] lg:min-h-0">
        {hasThread || isOpeningCurrent ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-dash-border bg-white">
                  <Image
                    src="/ai-coach-bot.png"
                    alt=""
                    width={36}
                    height={36}
                    className="h-8 w-8 object-contain"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-dash-ink">Afia AI</p>
                  <p className="text-xs text-dash-muted">Your content coach</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNewChat}
                aria-label="Start a new chat"
                className="inline-flex items-center gap-1.5 rounded-lg border border-dash-border bg-dash-surface px-3 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                New chat
              </button>
            </div>

            {isOpeningCurrent && messages.length === 0 ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-1 items-center justify-center gap-2 text-sm text-dash-muted"
              >
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading conversation…
              </div>
            ) : (
              <ChatThread
                messages={messages}
                isTyping={send.isPending}
                onRetry={handleRetry}
              />
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Image
              src="/ai-coach-bot.png"
              alt="Afia AI mascot"
              width={220}
              height={220}
              priority
              className="h-44 w-44 object-contain sm:h-52 sm:w-52"
            />
            <h1 className="mt-4 text-3xl font-bold text-dash-ink sm:text-4xl">
              Talk with{" "}
              <span className="bg-gradient-to-r from-teal-500 to-pink-500 bg-clip-text text-transparent">
                Afia AI
              </span>
            </h1>
            <p className="mt-2 max-w-sm text-sm text-dash-muted">
              Let&apos;s chat about how I can help you enhance your videos
            </p>
          </div>
        )}

        <div className="mt-6">
          {recorder.isRecording && (
            <p
              role="status"
              aria-live="polite"
              className="mb-2 flex items-center justify-center gap-2 text-xs font-medium text-red-600"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
              Recording… tap to stop
            </p>
          )}
          {transcribing && (
            <p
              role="status"
              aria-live="polite"
              className="mb-2 flex items-center justify-center gap-2 text-xs font-medium text-dash-muted"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Transcribing your recording…
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-full border border-dash-border bg-white px-2.5 py-2 shadow-dash"
          >
            <button
              type="button"
              onClick={handleMicClick}
              disabled={transcribing}
              aria-label={
                recorder.isRecording ? "Stop recording" : "Record voice"
              }
              aria-pressed={recorder.isRecording}
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand disabled:cursor-not-allowed disabled:opacity-60",
                recorder.isRecording
                  ? "animate-pulse bg-red-100 text-red-600"
                  : "text-dash-muted hover:bg-dash-bg",
              )}
            >
              {recorder.isRecording ? (
                <Square className="h-4 w-4 fill-current" aria-hidden="true" />
              ) : (
                <Mic className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <label htmlFor="ai-chat-input" className="sr-only">
              Ask Afia AI
            </label>
            <input
              id="ai-chat-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask questions about videos and content..."
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-dash-ink placeholder:text-dash-muted focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={sendDisabled}
              aria-label="Send message"
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-sm transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand",
                sendDisabled
                  ? "cursor-not-allowed bg-dash-border"
                  : "bg-gradient-to-br from-teal-400 to-teal-600 hover:opacity-90",
              )}
            >
              {send.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </form>

          {!hasThread && !isOpeningCurrent && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-dash-muted">
                Try asking:
              </span>
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setValue(prompt);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-dash-border bg-white px-3 py-1.5 text-xs text-dash-ink transition-colors hover:border-dash-brand/40 hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <aside className="space-y-6">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-dash-ink">
            What Afia can help with
          </h2>
          <ul className="mt-4 space-y-4">
            {helpItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${item.fg}`} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-dash-ink">
                      {item.title}
                    </p>
                    <p className="text-xs text-dash-muted">{item.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <ConversationsCard
          activeId={conversationId}
          onOpen={(id) => void openConversation(id)}
          onDeleted={handleConversationDeleted}
          onCleared={handleConversationCleared}
        />

        <div className="rounded-dash border border-dash-border bg-gradient-to-br from-teal-50 to-pink-50 p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-sm">
              <Sparkles className="h-5 w-5 text-teal-500" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-dash-ink">
                Get personalized tips
              </p>
              <p className="mt-0.5 text-xs text-dash-muted">
                Connect your social accounts to get more relevant advice.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-full bg-dash-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
          >
            Connect accounts
          </button>
        </div>
      </aside>
    </div>
  );
}
