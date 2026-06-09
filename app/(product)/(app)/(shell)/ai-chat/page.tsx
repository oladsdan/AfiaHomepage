"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  Lightbulb,
  FileText,
  Users,
  MessageSquare,
  Mic,
  Sparkles,
} from "lucide-react";
import { Card } from "../dashboard/_components/ui/Card";

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

const recentConversations = [
  { title: "How can I increase retention?", time: "10:30 AM" },
  { title: "Give me 5 viral video ideas", time: "Yesterday" },
  { title: "Best time to post on TikTok?", time: "2 days ago" },
  { title: "Why is my engagement low?", time: "3 days ago" },
];

export default function AiChatPage() {
  const [value, setValue] = useState("");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <section className="flex min-h-[26rem] flex-col lg:sticky lg:top-6 lg:h-[calc(100vh-7rem)] lg:min-h-0">
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

        <div className="mt-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-full border border-dash-border bg-white px-2.5 py-2 shadow-dash"
          >
            <button
              type="button"
              aria-label="Record voice"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-dash-muted transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              <Mic className="h-5 w-5" aria-hidden="true" />
            </button>
            <label htmlFor="ai-chat-input" className="sr-only">
              Ask Afia AI
            </label>
            <input
              id="ai-chat-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask questions about videos and content..."
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-dash-ink placeholder:text-dash-muted focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-dash-muted">
              Try asking:
            </span>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setValue(prompt)}
                className="rounded-full border border-dash-border bg-white px-3 py-1.5 text-xs text-dash-ink transition-colors hover:border-dash-brand/40 hover:bg-dash-bg"
              >
                {prompt}
              </button>
            ))}
          </div>
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

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dash-ink">
              Recent conversations
            </h2>
            <button
              type="button"
              className="text-xs font-medium text-dash-brand hover:underline"
            >
              View all
            </button>
          </div>
          <ul className="mt-4 space-y-1">
            {recentConversations.map((c) => (
              <li key={c.title}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-dash-bg"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-dash-bg text-dash-muted">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-dash-ink">
                    {c.title}
                  </span>
                  <span className="shrink-0 text-xs text-dash-muted">
                    {c.time}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

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
