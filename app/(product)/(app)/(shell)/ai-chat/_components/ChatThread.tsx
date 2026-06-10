"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "./ChatMarkdown";
import type { ChatMessage } from "./chatTypes";

function AssistantAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center self-start overflow-hidden rounded-full border border-dash-border bg-white">
      <Image
        src="/ai-coach-bot.png"
        alt=""
        width={32}
        height={32}
        className="h-7 w-7 object-contain"
        aria-hidden="true"
      />
    </span>
  );
}

/** Three animated dots — "Afia is typing…". */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <AssistantAvatar />
      <div
        className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-dash-border bg-dash-surface px-4 py-3 shadow-dash"
        aria-label="Afia is typing"
      >
        <span className="sr-only">Afia is typing…</span>
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-dash-muted [animation-delay:-0.3s]"
          aria-hidden="true"
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-dash-muted [animation-delay:-0.15s]"
          aria-hidden="true"
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-dash-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry: (message: ChatMessage) => void;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div
          className={cn(
            "max-w-[85%] rounded-2xl rounded-tr-sm bg-dash-brand px-4 py-2.5 text-sm leading-relaxed text-white shadow-dash",
            message.status === "sending" && "opacity-70",
            message.status === "failed" && "opacity-90 ring-1 ring-red-300",
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {message.status === "failed" && (
          <div className="flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Failed to send</span>
            <button
              type="button"
              onClick={() => onRetry(message)}
              aria-label="Retry sending message"
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-dash-brand transition-colors hover:bg-dash-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <AssistantAvatar />
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-dash-border bg-dash-surface px-4 py-2.5 text-dash-ink shadow-dash">
        <ChatMarkdown content={message.content} />
      </div>
    </div>
  );
}

export function ChatThread({
  messages,
  isTyping,
  onRetry,
}: {
  messages: ChatMessage[];
  isTyping: boolean;
  onRetry: (message: ChatMessage) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message / typing indicator.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversation with Afia AI"
      className="flex-1 space-y-4 overflow-y-auto pb-2 pr-1"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onRetry={onRetry} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}
