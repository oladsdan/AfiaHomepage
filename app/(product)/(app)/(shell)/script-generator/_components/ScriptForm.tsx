"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { platforms } from "@/lib/web/caption-generator-data";
import {
  scriptTypes,
  scriptLengths,
  toneOptions,
} from "@/lib/web/script-generator-data";
import { Card } from "../../dashboard/_components/ui/Card";
import { SelectableTile } from "../../caption-generator/_components/SelectableTile";
import { ScriptTypeCard } from "./ScriptTypeCard";

const MAX_CHARS = 2000;

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-dash-ink">{children}</h2>;
}

export function ScriptForm() {
  const [idea, setIdea] = useState("");
  const [scriptType, setScriptType] = useState<string | null>(null);
  const [length, setLength] = useState("short");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("confident");

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <label
          htmlFor="script-idea"
          className="text-sm font-semibold text-dash-ink"
        >
          Describe your idea in a few sentences.
        </label>
        <div className="relative mt-3">
          <textarea
            id="script-idea"
            value={idea}
            maxLength={MAX_CHARS}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: I want to make a short video about 5 money habits that changed my life..."
            rows={5}
            className="w-full resize-none rounded-dash border border-dash-border bg-dash-bg p-4 pb-8 text-sm text-dash-ink placeholder:text-dash-muted focus:border-dash-brand focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-dash-muted">
            {idea.length}/{MAX_CHARS}
          </span>
        </div>
      </Card>

      <section>
        <SectionTitle>What Type of Script Do You Need?</SectionTitle>
        <div
          role="radiogroup"
          aria-label="Script type"
          className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {scriptTypes.map((t) => (
            <ScriptTypeCard
              key={t.id}
              option={t}
              selected={scriptType === t.id}
              onSelect={() => setScriptType(t.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Length</SectionTitle>
        <div className="relative mt-3">
          <select
            aria-label="Length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full appearance-none rounded-dash border border-dash-border bg-dash-surface px-4 py-3 pr-10 text-sm font-medium text-dash-ink focus:border-dash-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40"
          >
            {scriptLengths.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted"
            aria-hidden="true"
          />
        </div>
      </section>

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
        <SectionTitle>Tone &amp; Energy</SectionTitle>
        <div
          role="radiogroup"
          aria-label="Tone and energy"
          className="mt-3 flex flex-wrap gap-3"
        >
          {toneOptions.map((t) => (
            <SelectableTile
              key={t.id}
              selected={tone === t.id}
              onSelect={() => setTone(t.id)}
              ariaLabel={t.label}
              className="rounded-full px-4 py-2.5"
            >
              <span className="text-sm font-medium text-dash-ink">{t.label}</span>
            </SelectableTile>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-dash bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-dash-md transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Generate Script
      </button>
    </div>
  );
}
