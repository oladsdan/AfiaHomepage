"use client";

import { Bookmark, Sparkles } from "lucide-react";
import { platforms, audiences } from "@/lib/web/caption-generator-data";
import { videoTypes } from "@/lib/web/content-ideas-data";
import { cn } from "@/lib/utils";
import { Card } from "../../dashboard/_components/ui/Card";
import { SelectableTile } from "../../caption-generator/_components/SelectableTile";

const MAX_CHARS = 500;

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-dash-ink">{children}</h2>;
}

export interface IdeaFormValues {
  topic: string;
  platforms: string[];
  videoType: string | null;
  audiences: string[];
}

/**
 * Controlled idea-generation form. Platforms and audiences are multi-select,
 * video type is single-select — matching the mobile IdeaGenerator.
 */
export function ContentIdeasForm({
  values,
  onChange,
  isGenerating,
  onGenerate,
  onOpenSaved,
}: {
  values: IdeaFormValues;
  onChange: (next: IdeaFormValues) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onOpenSaved: () => void;
}) {
  const { topic, platforms: selPlatforms, videoType, audiences: selAud } =
    values;

  const togglePlatform = (id: string) => {
    onChange({
      ...values,
      platforms: selPlatforms.includes(id)
        ? selPlatforms.filter((p) => p !== id)
        : [...selPlatforms, id],
    });
  };
  const toggleAudience = (id: string) => {
    onChange({
      ...values,
      audiences: selAud.includes(id)
        ? selAud.filter((a) => a !== id)
        : [...selAud, id],
    });
  };

  const ready =
    topic.trim().length > 0 &&
    selPlatforms.length > 0 &&
    videoType !== null &&
    selAud.length > 0;
  const canGenerate = ready && !isGenerating;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-dash-ink">
            Get Fresh Content Ideas
            <Sparkles className="h-5 w-5 text-dash-brand" aria-hidden="true" />
          </h1>
          <p className="mt-1 text-sm text-dash-muted">
            Generate creative, high-performing video ideas tailored to your
            audience and niche.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenSaved}
          aria-haspopup="dialog"
          className="inline-flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          Saved ideas
        </button>
      </div>

      <Card className="p-5">
        <label htmlFor="topic" className="text-sm font-semibold text-dash-ink">
          Topic
        </label>
        <div className="relative mt-3">
          <textarea
            id="topic"
            value={topic}
            maxLength={MAX_CHARS}
            onChange={(e) => onChange({ ...values, topic: e.target.value })}
            placeholder="e.g Motivation, lifestyle, making money online, fitness..."
            rows={4}
            className="w-full resize-none rounded-dash border border-dash-border bg-dash-bg p-4 pb-8 text-sm text-dash-ink placeholder:text-dash-muted focus:border-dash-brand focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-dash-muted">
            {topic.length}/{MAX_CHARS}
          </span>
        </div>
      </Card>

      <section>
        <SectionTitle>Posting on</SectionTitle>
        <div
          role="group"
          aria-label="Posting on"
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {platforms.map((p) => {
            const Icon = p.icon;
            const selected = selPlatforms.includes(p.id);
            return (
              <SelectableTile
                key={p.id}
                selected={selected}
                onSelect={() => togglePlatform(p.id)}
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
        <SectionTitle>Video type</SectionTitle>
        <div
          role="radiogroup"
          aria-label="Video type"
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {videoTypes.map((v) => (
            <SelectableTile
              key={v.id}
              selected={videoType === v.id}
              onSelect={() => onChange({ ...values, videoType: v.id })}
              ariaLabel={v.label}
              className="rounded-full px-4 py-2.5"
            >
              <span className="text-sm font-medium text-dash-ink">{v.label}</span>
            </SelectableTile>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Audience</SectionTitle>
        <div
          role="group"
          aria-label="Audience"
          className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {audiences.map((a) => (
            <SelectableTile
              key={a.id}
              selected={selAud.includes(a.id)}
              onSelect={() => toggleAudience(a.id)}
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
        onClick={onGenerate}
        disabled={!canGenerate}
        aria-busy={isGenerating}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-dash px-6 py-4 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2",
          canGenerate
            ? "bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 text-white shadow-dash-md hover:opacity-95"
            : "cursor-not-allowed bg-dash-border text-dash-muted",
        )}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {isGenerating ? "Generating…" : "Generate Content Ideas"}
      </button>
    </div>
  );
}
