"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Check,
  Copy,
  Loader2,
  RefreshCw,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import {
  editCaption,
  saveCaption,
  SAVED_CAPTIONS_QUERY_KEY,
  type CaptionEditInput,
} from "@/lib/web/ai/captions-api";
import type { CaptionOption } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";

export interface CaptionSaveMeta {
  platforms: string[];
  style: string;
  audience: string;
}

const actionButtonClasses =
  "inline-flex items-center gap-1.5 rounded-lg border border-dash-border bg-dash-surface px-3 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

function CaptionResultCard({
  option,
  saveMeta,
  onReplaceText,
}: {
  option: CaptionOption;
  saveMeta: CaptionSaveMeta;
  onReplaceText: (id: string, text: string) => void;
}) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const refine = useAiMutation<string, CaptionEditInput>({
    mutationFn: editCaption,
    onSuccess: (edited) => {
      if (edited.trim()) {
        onReplaceText(option.id, edited);
        setRefineOpen(false);
        setEditPrompt("");
      } else {
        toast("Couldn't refine this caption. Please try again.");
      }
    },
  });

  const save = useAiMutation<void, void>({
    mutationFn: () => saveCaption({ text: option.text, ...saveMeta }),
    onSuccess: () => {
      toast("Caption saved", "success");
      void queryClient.invalidateQueries({
        queryKey: SAVED_CAPTIONS_QUERY_KEY,
      });
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(option.text).then(() => {
      toast("Copied to clipboard", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRefineSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = editPrompt.trim();
    if (!prompt || refine.isPending) return;
    refine.mutate({ originalCaption: option.text, editPrompt: prompt });
  };

  return (
    <Card className="p-5">
      <p
        className={cn(
          "whitespace-pre-wrap text-sm leading-relaxed text-dash-ink",
          refine.isPending && "opacity-50",
        )}
      >
        {option.text}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy caption to clipboard"
          className={actionButtonClasses}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-dash-brand" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>

        <button
          type="button"
          onClick={() => setRefineOpen((v) => !v)}
          aria-expanded={refineOpen}
          aria-label={refineOpen ? "Hide refine options" : "Refine this caption"}
          className={cn(
            actionButtonClasses,
            refineOpen && "border-dash-brand text-dash-brand",
          )}
        >
          <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
          Refine
        </button>

        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          aria-label="Save caption"
          className={actionButtonClasses}
        >
          {save.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Save
        </button>
      </div>

      {refineOpen && (
        <form
          onSubmit={handleRefineSubmit}
          className="mt-3 flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="e.g. Make it shorter and add a question at the end"
            aria-label="How should this caption be refined?"
            disabled={refine.isPending}
            className="flex-1 rounded-lg border border-dash-border bg-dash-bg px-3 py-2 text-sm text-dash-ink placeholder:text-dash-muted focus:border-dash-brand focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!editPrompt.trim() || refine.isPending}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2",
              !editPrompt.trim() || refine.isPending
                ? "cursor-not-allowed bg-dash-border text-dash-muted"
                : "bg-dash-brand hover:bg-dash-brand-dark",
            )}
          >
            {refine.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {refine.isPending ? "Refining…" : "Refine"}
          </button>
        </form>
      )}
    </Card>
  );
}

export function CaptionResults({
  captions,
  saveMeta,
  onReplaceText,
  onGenerateAgain,
  generateDisabled,
}: {
  captions: CaptionOption[];
  saveMeta: CaptionSaveMeta;
  onReplaceText: (id: string, text: string) => void;
  onGenerateAgain: () => void;
  generateDisabled: boolean;
}) {
  return (
    <section aria-label="Generated captions" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-dash-ink">Your captions</h2>
        <button
          type="button"
          onClick={onGenerateAgain}
          disabled={generateDisabled}
          aria-label="Generate captions again"
          className={actionButtonClasses}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Generate again
        </button>
      </div>

      {captions.length === 0 ? (
        <Card className="p-5">
          <p className="text-sm text-dash-muted">
            No captions came back this time. Try generating again.
          </p>
        </Card>
      ) : (
        captions.map((option) => (
          <CaptionResultCard
            key={option.id}
            option={option}
            saveMeta={saveMeta}
            onReplaceText={onReplaceText}
          />
        ))
      )}
    </section>
  );
}
