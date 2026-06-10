"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/web/toast";

/**
 * Icon (or icon + label) button that copies `text` to the clipboard, toasts
 * success, and swaps to a transient check mark.
 */
export function CopyButton({
  text,
  label = "Copy to clipboard",
  showLabel,
  className,
}: {
  text: string;
  /** Accessible label, e.g. "Copy caption 1". */
  label?: string;
  /** Render a visible text label next to the icon. */
  showLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Copied to clipboard", "success");
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast("Couldn't copy to clipboard");
      });
  };

  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg p-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand",
        copied
          ? "text-dash-brand"
          : "text-dash-muted hover:bg-dash-bg hover:text-dash-ink",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {showLabel && <span>{showLabel}</span>}
    </button>
  );
}
