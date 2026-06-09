"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import {
  helpItems,
  recentConversations,
} from "@/lib/web/caption-generator-data";
import { Card } from "../../dashboard/_components/ui/Card";

export function HelpSidebar() {
  return (
    <aside className="space-y-6">
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-dash-ink">
          What Afia can help with
        </h2>
        <ul className="mt-4 space-y-4">
          {helpItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dash-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-dash-muted">
                    {item.description}
                  </p>
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
            className="text-xs font-semibold text-dash-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 rounded"
          >
            View all
          </button>
        </div>
        <ul className="mt-4 space-y-1">
          {recentConversations.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
              >
                <MessageCircle
                  className="h-4 w-4 shrink-0 text-dash-muted"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-dash-ink">
                  {c.text}
                </span>
                <span className="shrink-0 text-xs text-dash-muted">{c.time}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="rounded-dash border border-dash-border bg-gradient-to-br from-violet-50 via-white to-teal-50 p-5 shadow-dash">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-dash">
            <Sparkles className="h-5 w-5 text-violet-500" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-dash-ink">
              Get personalized tips
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-dash-muted">
              Connect your social accounts to get more relevant advice.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 rounded-lg bg-dash-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          Connect accounts
        </button>
      </div>
    </aside>
  );
}
