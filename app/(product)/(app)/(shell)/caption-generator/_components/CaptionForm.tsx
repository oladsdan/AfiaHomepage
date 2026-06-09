"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  platforms,
  captionStyles,
  audiences,
} from "@/lib/web/caption-generator-data";
import { Card } from "../../dashboard/_components/ui/Card";
import { SelectableTile } from "./SelectableTile";

const MAX_CHARS = 2000;

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-dash-ink">{children}</h2>;
}

export function CaptionForm() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [style, setStyle] = useState("conversational");
  const [audience, setAudience] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <label htmlFor="post-about" className="text-sm font-semibold text-dash-ink">
          What&apos;s your post about?
        </label>
        <div className="relative mt-3">
          <textarea
            id="post-about"
            value={text}
            maxLength={MAX_CHARS}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. A short vlog about my journey to earning my first $5.6k online"
            rows={5}
            className="w-full resize-none rounded-dash border border-dash-border bg-dash-bg p-4 pb-8 text-sm text-dash-ink placeholder:text-dash-muted focus:border-dash-brand focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-dash-muted">
            {text.length}/{MAX_CHARS}
          </span>
        </div>
      </Card>

      <section>
        <SectionTitle>Posting on</SectionTitle>
        <div
          role="radiogroup"
          aria-label="Posting on"
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {platforms.map((p) => {
            const Icon = p.icon;
            const selected = platform === p.id;
            return (
              <SelectableTile
                key={p.id}
                selected={selected}
                onSelect={() => setPlatform(p.id)}
                ariaLabel={p.label}
                className="flex-col gap-2 px-3 py-4"
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: selected ? p.color : "#6b7785" }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-dash-ink">{p.label}</span>
              </SelectableTile>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle>Caption Style</SectionTitle>
        <div
          role="radiogroup"
          aria-label="Caption style"
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {captionStyles.map((s) => (
            <SelectableTile
              key={s.id}
              selected={style === s.id}
              onSelect={() => setStyle(s.id)}
              ariaLabel={s.label}
              className="gap-2 px-4 py-3.5"
            >
              <span className="text-lg" aria-hidden="true">
                {s.emoji}
              </span>
              <span className="text-sm font-medium text-dash-ink">{s.label}</span>
            </SelectableTile>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Audience</SectionTitle>
        <div
          role="radiogroup"
          aria-label="Audience"
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {audiences.map((a) => (
            <SelectableTile
              key={a.id}
              selected={audience === a.id}
              onSelect={() => setAudience(a.id)}
              ariaLabel={a.label}
              className="flex-col gap-2 px-3 py-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.avatar}
                alt=""
                aria-hidden="true"
                className="h-16 w-16 object-contain"
              />
              <span className="text-sm font-medium text-dash-ink">{a.label}</span>
            </SelectableTile>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-dash bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-dash-md transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Generate Captions
      </button>
    </div>
  );
}
