"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, Clock, Copy, Loader2, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";
import { useAiMutation } from "@/lib/web/ai/useAiMutation";
import {
  saveScript,
  SAVED_SCRIPTS_QUERY_KEY,
} from "@/lib/web/ai/scripts-api";
import type { GeneratedScript } from "@/lib/web/ai/types";
import { scriptTypes } from "@/lib/web/script-generator-data";
import { Card } from "../../dashboard/_components/ui/Card";

export const scriptActionButtonClasses =
  "inline-flex items-center gap-1.5 rounded-lg border border-dash-border bg-dash-surface px-3 py-1.5 text-xs font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

/** "storytelling" → "Storytelling"; unknown ids render as-is. */
export function scriptTypeLabel(type: string | undefined): string | null {
  if (!type) return null;
  const match = scriptTypes.filter((t) => t.id === type)[0];
  return match ? match.title : type;
}

/**
 * estimatedDuration may be a number of seconds or a free-form string
 * ("30-45 seconds") — render defensively.
 */
export function formatScriptDuration(
  value: string | number | undefined,
): string | null {
  if (value === undefined || value === null) return null;
  const seconds =
    typeof value === "number"
      ? value
      : /^\d+(\.\d+)?$/.test(value.trim())
        ? Number(value.trim())
        : NaN;
  if (Number.isFinite(seconds) && seconds >= 0) {
    const total = Math.round(seconds);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    if (mins === 0) return `${secs}s`;
    return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

/** Type + estimated-duration chips shown under a script title. */
export function ScriptChips({
  type,
  estimatedDuration,
}: {
  type?: string;
  estimatedDuration?: string | number;
}) {
  const typeLabel = scriptTypeLabel(type);
  const duration = formatScriptDuration(estimatedDuration);
  if (!typeLabel && !duration) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {typeLabel && (
        <span className="inline-flex items-center rounded-full bg-dash-brand/10 px-2.5 py-1 text-xs font-semibold text-dash-brand">
          {typeLabel}
        </span>
      )}
      {duration && (
        <span className="inline-flex items-center gap-1 rounded-full border border-dash-border bg-dash-bg px-2.5 py-1 text-xs font-medium text-dash-muted">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {duration}
        </span>
      )}
    </div>
  );
}

/** Prominent quote-styled callout for the script's hook line. */
export function HookCallout({ hook }: { hook: string }) {
  return (
    <div className="rounded-dash border border-dash-brand/30 bg-dash-brand/5 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-dash-brand">
        <Quote className="h-3.5 w-3.5" aria-hidden="true" />
        Hook
      </p>
      <blockquote className="mt-2 border-l-2 border-dash-brand pl-3 text-base font-medium italic leading-relaxed text-dash-ink">
        &ldquo;{hook}&rdquo;
      </blockquote>
    </div>
  );
}

/**
 * Markdown body. The container carries `prose` classes (Tailwind typography),
 * but element styling is also applied explicitly via the `components` map so
 * headings/lists render nicely with the dash palette regardless.
 */
export function ScriptMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none text-dash-ink">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-bold text-dash-ink first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="mb-2 mt-5 text-sm font-bold text-dash-ink first:mt-0">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="mb-1.5 mt-4 text-sm font-semibold text-dash-ink first:mt-0">
              {children}
            </h5>
          ),
          h4: ({ children }) => (
            <h6 className="mb-1.5 mt-4 text-sm font-semibold text-dash-ink first:mt-0">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="my-2 text-sm leading-relaxed text-dash-ink">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-2 list-disc space-y-1 pl-5 text-sm text-dash-ink">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 list-decimal space-y-1 pl-5 text-sm text-dash-ink">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed text-dash-ink">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-dash-ink">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-dash-brand/40 pl-3 italic text-dash-muted">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-dash-bg px-1.5 py-0.5 font-geist-mono text-xs text-dash-ink">
              {children}
            </code>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-dash-brand underline hover:text-dash-brand-dark"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-4 border-dash-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Copy button with transient Check swap; copies the raw markdown. */
export function CopyScriptButton({
  text,
  ariaLabel,
}: {
  text: string;
  ariaLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast("Copied to clipboard", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={scriptActionButtonClasses}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-dash-brand" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** Full view for a freshly generated script: chips, hook, markdown, actions. */
export function ScriptResult({ script }: { script: GeneratedScript }) {
  const queryClient = useQueryClient();

  const save = useAiMutation<void, void>({
    mutationFn: () => saveScript(script),
    onSuccess: () => {
      toast("Script saved", "success");
      void queryClient.invalidateQueries({
        queryKey: SAVED_SCRIPTS_QUERY_KEY,
      });
    },
  });

  return (
    <section aria-label="Generated script">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-dash-ink">
              {script.title || "Your script"}
            </h2>
            <div className="mt-2">
              <ScriptChips
                type={script.type}
                estimatedDuration={script.estimatedDuration}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CopyScriptButton
              text={script.content}
              ariaLabel="Copy script markdown to clipboard"
            />
            <button
              type="button"
              onClick={() => save.mutate()}
              disabled={save.isPending}
              aria-label="Save script"
              className={cn(scriptActionButtonClasses)}
            >
              {save.isPending ? (
                <Loader2
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Save
            </button>
          </div>
        </div>

        {script.hookLine && (
          <div className="mt-4">
            <HookCallout hook={script.hookLine} />
          </div>
        )}

        <div className="mt-4">
          <ScriptMarkdown content={script.content} />
        </div>
      </Card>
    </section>
  );
}
