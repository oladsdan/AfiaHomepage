"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  platforms,
  captionStyles,
  audiences,
} from "@/lib/web/caption-generator-data";
import { cn } from "@/lib/utils";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import { generateCaptions } from "@/lib/web/ai/captions-api";
import type { CaptionGenerateInput, CaptionOption } from "@/lib/web/ai/types";
import { AiGenerating } from "@/app/(product)/_components/AiGenerating";
import { Card } from "../../dashboard/_components/ui/Card";
import { SelectableTile } from "./SelectableTile";
import { CaptionResults, type CaptionSaveMeta } from "./CaptionResults";

const MAX_CHARS = 2000;

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-dash-ink">{children}</h2>;
}

export function CaptionForm() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [style, setStyle] = useState("conversational");
  const [audience, setAudience] = useState<string | null>(null);

  const [results, setResults] = useState<CaptionOption[] | null>(null);
  const [saveMeta, setSaveMeta] = useState<CaptionSaveMeta | null>(null);

  const generate = useAiMutation<CaptionOption[], CaptionGenerateInput>({
    mutationFn: generateCaptions,
    onSuccess: (data, variables) => {
      setResults(data);
      setSaveMeta({
        platforms: variables.platforms,
        style: variables.style,
        audience: variables.audience,
      });
    },
  });

  const ready = text.trim().length > 0 && audience !== null;
  const canGenerate = ready && !generate.isPending;

  const handleGenerate = () => {
    if (!ready || generate.isPending || audience === null) return;
    generate.mutate({
      description: text.trim(),
      platforms: [platform],
      style,
      audience,
    });
  };

  const handleReplaceText = (id: string, newText: string) => {
    setResults((prev) =>
      prev
        ? prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
        : prev,
    );
  };

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
        onClick={handleGenerate}
        disabled={!canGenerate}
        aria-busy={generate.isPending}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-dash px-6 py-4 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2",
          canGenerate
            ? "bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 text-white shadow-dash-md hover:opacity-95"
            : "cursor-not-allowed bg-dash-border text-dash-muted",
        )}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {generate.isPending ? "Generating…" : "Generate Captions"}
      </button>

      {generate.isPending ? (
        <AiGenerating
          label="Writing your captions…"
          sublabel="This usually takes a few seconds."
        />
      ) : results && saveMeta ? (
        <CaptionResults
          captions={results}
          saveMeta={saveMeta}
          onReplaceText={handleReplaceText}
          onGenerateAgain={handleGenerate}
          generateDisabled={!ready}
        />
      ) : null}
    </div>
  );
}
