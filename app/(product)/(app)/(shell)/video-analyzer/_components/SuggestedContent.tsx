"use client";

import { Hash } from "lucide-react";
import { toast } from "@/lib/web/toast";
import { Card } from "../../dashboard/_components/ui/Card";
import { CopyButton } from "./CopyButton";

/** Suggested captions + hashtags with copy actions. */
export function SuggestedContent({
  captions,
  hashtags,
}: {
  captions: string[] | undefined;
  hashtags: string[] | undefined;
}) {
  const captionList = (captions ?? []).filter(
    (c): c is string => typeof c === "string" && c.length > 0,
  );
  const hashtagList = (hashtags ?? [])
    .filter((h): h is string => typeof h === "string" && h.length > 0)
    .map((h) => (h.charAt(0) === "#" ? h : `#${h}`));

  if (captionList.length === 0 && hashtagList.length === 0) return null;

  const copyHashtag = (tag: string) => {
    navigator.clipboard
      .writeText(tag)
      .then(() => toast("Copied to clipboard", "success"))
      .catch(() => toast("Couldn't copy to clipboard"));
  };

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-dash-ink">
        Suggested captions &amp; hashtags
      </h2>

      {captionList.length > 0 && (
        <div className="mt-4 space-y-2">
          {captionList.map((caption, index) => (
            <div
              key={index}
              className="flex items-start gap-2 rounded-dash border border-dash-border bg-dash-bg/50 px-4 py-3"
            >
              <p className="flex-1 text-sm leading-relaxed text-dash-ink">
                {caption}
              </p>
              <CopyButton text={caption} label={`Copy caption ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      {hashtagList.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-dash-muted">
              Hashtags
            </p>
            <CopyButton
              text={hashtagList.join(" ")}
              label="Copy all hashtags"
              showLabel="Copy all"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {hashtagList.map((tag, index) => (
              <button
                key={`${tag}-${index}`}
                type="button"
                onClick={() => copyHashtag(tag)}
                aria-label={`Copy hashtag ${tag}`}
                className="inline-flex items-center gap-1 rounded-full border border-dash-border bg-dash-surface px-3 py-1 text-xs font-medium text-dash-ink transition-colors hover:border-dash-brand hover:text-dash-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
              >
                <Hash className="h-3 w-3 text-dash-muted" aria-hidden="true" />
                {tag.replace(/^#/, "")}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
