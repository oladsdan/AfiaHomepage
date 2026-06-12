"use client";

import { useState } from "react";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import { generateIdeas } from "@/lib/web/ai/ideas-api";
import type { ContentIdea, IdeaGenerateInput } from "@/lib/web/ai/types";
import { ContentIdeasForm, type IdeaFormValues } from "./ContentIdeasForm";
import { CraftingIdeas } from "./CraftingIdeas";
import { IdeaBreakdown, type IdeaHooksContext } from "./IdeaBreakdown";
import { IdeaResultsList } from "./IdeaResultsList";
import { SavedIdeasPanel } from "./SavedIdeasPanel";

type View = "form" | "generating" | "results" | "breakdown";

interface ActiveBreakdown {
  idea: ContentIdea;
  hooksContext: IdeaHooksContext;
  alreadySaved: boolean;
}

const INITIAL_FORM: IdeaFormValues = {
  topic: "",
  platforms: [],
  videoType: null,
  audiences: [],
};

/** Read a string[] off an unknown field (saved ideas store platforms/audience). */
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/**
 * Orchestrates the Idea Generator flow (mirrors the mobile app):
 * form → generating → results list → idea breakdown, plus a saved-ideas panel
 * that opens any saved idea straight into its breakdown.
 */
export function ContentIdeas() {
  const [view, setView] = useState<View>("form");
  const [form, setForm] = useState<IdeaFormValues>(INITIAL_FORM);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [genParams, setGenParams] = useState<IdeaGenerateInput | null>(null);
  const [active, setActive] = useState<ActiveBreakdown | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);

  const generate = useAiMutation<ContentIdea[], IdeaGenerateInput>({
    mutationFn: generateIdeas,
    onSuccess: (result, variables) => {
      setIdeas(result);
      setGenParams(variables);
      setView("results");
    },
    onError: () => {
      // useAiMutation already surfaced the error; return to the form.
      setView((v) => (v === "generating" ? "form" : v));
    },
  });

  const runGenerate = (params: IdeaGenerateInput) => {
    setGenParams(params);
    setView("generating");
    generate.mutate(params);
  };

  const handleGenerate = () => {
    if (form.videoType === null) return;
    runGenerate({
      description: form.topic.trim(),
      platforms: form.platforms,
      videoType: form.videoType,
      audience: form.audiences,
    });
  };

  const handleRefresh = () => {
    if (genParams) runGenerate(genParams);
  };

  const openIdea = (idea: ContentIdea) => {
    setActive({
      idea,
      hooksContext: {
        videoType: genParams?.videoType ?? "",
        platforms: genParams?.platforms ?? [],
      },
      alreadySaved: false,
    });
    setView("breakdown");
  };

  const openSavedIdea = (idea: ContentIdea) => {
    setActive({
      idea,
      hooksContext: {
        videoType:
          typeof idea.videoType === "string" ? idea.videoType : "",
        platforms: toStringArray(idea.platforms),
      },
      alreadySaved: true,
    });
    setSavedOpen(false);
    setView("breakdown");
  };

  return (
    <>
      {view === "form" && (
        <ContentIdeasForm
          values={form}
          onChange={setForm}
          isGenerating={generate.isPending}
          onGenerate={handleGenerate}
          onOpenSaved={() => setSavedOpen(true)}
        />
      )}

      {view === "generating" && (
        <div className="mx-auto max-w-3xl">
          <CraftingIdeas />
        </div>
      )}

      {view === "results" && (
        <IdeaResultsList
          ideas={ideas}
          refreshing={generate.isPending}
          onOpen={openIdea}
          onRefresh={handleRefresh}
          onBack={() => setView("form")}
        />
      )}

      {view === "breakdown" && active && (
        <IdeaBreakdown
          idea={active.idea}
          hooksContext={active.hooksContext}
          alreadySaved={active.alreadySaved}
          onBack={() => setView(ideas.length > 0 ? "results" : "form")}
        />
      )}

      <SavedIdeasPanel
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        onOpenIdea={openSavedIdea}
      />
    </>
  );
}
