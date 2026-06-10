"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { platforms, audiences } from "@/lib/web/caption-generator-data";
import { videoTypes } from "@/lib/web/content-ideas-data";
import { cn } from "@/lib/utils";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import { generateIdeas } from "@/lib/web/ai/ideas-api";
import type { ContentIdea, IdeaGenerateInput } from "@/lib/web/ai/types";
import { AiGenerating } from "@/app/(product)/_components/AiGenerating";
import { Card } from "../../dashboard/_components/ui/Card";
import { SelectableTile } from "../../caption-generator/_components/SelectableTile";
import { IdeaResultCard, type IdeaHooksContext } from "./IdeaView";

const MAX_CHARS = 200;

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-sm font-semibold text-dash-ink">{children}</h2>;
}

interface IdeaResults {
  ideas: ContentIdea[];
  /** The video type + platforms that produced these ideas (drives More hooks). */
  hooksContext: IdeaHooksContext;
}

export function ContentIdeasForm() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [videoType, setVideoType] = useState<string | null>(null);
  const [audience, setAudience] = useState<string | null>(null);

  const [results, setResults] = useState<IdeaResults | null>(null);

  const generate = useAiMutation<ContentIdea[], IdeaGenerateInput>({
    mutationFn: generateIdeas,
    onSuccess: (ideas, variables) => {
      setResults({
        ideas,
        hooksContext: {
          videoType: variables.videoType,
          platforms: variables.platforms,
        },
      });
    },
  });

  const ready =
    topic.trim().length > 0 && videoType !== null && audience !== null;
  const canGenerate = ready && !generate.isPending;

  const handleGenerate = () => {
    if (!ready || generate.isPending || videoType === null || audience === null)
      return;
    generate.mutate({
      description: topic.trim(),
      platforms: [platform],
      videoType,
      audience,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <label htmlFor="topic" className="text-sm font-semibold text-dash-ink">
          Topic
        </label>
        <div className="relative mt-3">
          <textarea
            id="topic"
            value={topic}
            maxLength={MAX_CHARS}
            onChange={(e) => setTopic(e.target.value)}
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
              onSelect={() => setVideoType(v.id)}
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
        {generate.isPending ? "Generating…" : "Generate Content Ideas"}
      </button>

      {generate.isPending ? (
        <AiGenerating
          label="Brainstorming ideas…"
          sublabel="This usually takes a few seconds."
        />
      ) : results ? (
        <section aria-label="Generated content ideas" className="space-y-4">
          <h2 className="text-lg font-bold text-dash-ink">Your content ideas</h2>
          {results.ideas.length === 0 ? (
            <Card className="p-5">
              <p className="text-sm text-dash-muted">
                No ideas came back this time. Try generating again.
              </p>
            </Card>
          ) : (
            results.ideas.map((idea, i) => (
              <IdeaResultCard
                key={idea.id ?? `idea-${i}`}
                idea={idea}
                hooksContext={results.hooksContext}
              />
            ))
          )}
        </section>
      ) : null}
    </div>
  );
}
