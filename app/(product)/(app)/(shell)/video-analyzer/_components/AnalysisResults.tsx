"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { History, Loader2, RefreshCw, Send, Sparkles } from "lucide-react";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import { askAnalysisFollowup } from "@/lib/web/ai/videos-api";
import type { VideoAnalysis } from "@/lib/web/ai/types";
import { Card } from "../../dashboard/_components/ui/Card";
import { CategoryScores } from "./CategoryScores";
import { Recommendations } from "./Recommendations";
import { RevisionInsights } from "./RevisionInsights";
import { ScoreCard } from "./ScoreCard";
import { StrengthsList } from "./StrengthsList";
import { SuggestedContent } from "./SuggestedContent";

interface FollowupExchange {
  question: string;
  answer: string;
}

function FollowupSection({ analysisId }: { analysisId: string }) {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<FollowupExchange[]>([]);

  const ask = useAiMutation<string, string>({
    mutationFn: (q) => askAnalysisFollowup(analysisId, q),
    onSuccess: (answer, q) => {
      setExchanges((prev) => [
        ...prev,
        { question: q, answer: answer || "No answer returned. Try rephrasing." },
      ]);
      setQuestion("");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || ask.isPending) return;
    ask.mutate(trimmed);
  };

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-dash-ink">
        Ask Afia about this analysis
      </h2>
      <p className="mt-1 text-xs text-dash-muted">
        Get clarification on any score or recommendation.
      </p>

      {exchanges.length > 0 && (
        <div className="mt-4 space-y-3">
          {exchanges.map((exchange, index) => (
            <div key={index} className="space-y-2">
              <p className="rounded-dash bg-dash-bg px-4 py-2.5 text-sm text-dash-ink">
                {exchange.question}
              </p>
              <p className="whitespace-pre-wrap rounded-dash border border-dash-border px-4 py-2.5 text-sm leading-relaxed text-dash-ink">
                {exchange.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <label htmlFor={`followup-${analysisId}`} className="sr-only">
          Ask a question about this analysis
        </label>
        <input
          id={`followup-${analysisId}`}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How can I improve my hook?"
          disabled={ask.isPending}
          className="w-full flex-1 rounded-xl border border-dash-border bg-dash-surface px-4 py-2.5 text-sm text-dash-ink placeholder:text-dash-muted focus:border-dash-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={ask.isPending || !question.trim()}
          aria-label="Send question"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-dash-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          {ask.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          Ask
        </button>
      </form>
    </Card>
  );
}

/** Full results view for a completed analysis. */
export function AnalysisResults({
  analysis,
  onAnalyzeRevision,
}: {
  analysis: VideoAnalysis;
  /** Re-enter the upload flow carrying parentAnalysisId = this analysis id. */
  onAnalyzeRevision: (analysisId: string) => void;
}) {
  const videoName =
    analysis.videoTitle || analysis.title || analysis.fileName || null;
  const followupRef = useRef<HTMLDivElement>(null);

  const scrollToCoach = () => {
    followupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const input = followupRef.current?.querySelector("input");
    if (input instanceof HTMLInputElement) {
      window.setTimeout(() => input.focus(), 400);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-dash-ink sm:text-2xl">
            Video analysis
          </h1>
          {videoName && (
            <p className="mt-0.5 truncate text-sm text-dash-muted">
              {videoName}
            </p>
          )}
        </div>
        <Link
          href="/recent-videos"
          className="inline-flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          Past analyses
        </Link>
      </div>

      <ScoreCard analysis={analysis} onChatPress={scrollToCoach} />
      <RevisionInsights analysis={analysis} />
      <Recommendations recommendations={analysis.recommendations} />
      <StrengthsList analysis={analysis} />
      <SuggestedContent
        captions={analysis.suggestedCaptions}
        hashtags={analysis.suggestedHashtags}
      />
      <CategoryScores analysis={analysis} />
      <div ref={followupRef} className="scroll-mt-6">
        <FollowupSection analysisId={analysis.id} />
      </div>

      {/* Revision banner */}
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash-brand/10 text-dash-brand">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-dash-ink">
              Made improvements?
            </p>
            <p className="text-xs text-dash-muted">
              Upload a revised cut and we&apos;ll compare it with this analysis.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAnalyzeRevision(analysis.id)}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-dash-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Analyze a revision
        </button>
      </Card>
    </div>
  );
}
