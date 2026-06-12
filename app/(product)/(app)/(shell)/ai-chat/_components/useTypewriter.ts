"use client";

import { useEffect, useRef, useState } from "react";

export interface TypewriterResult {
  /** The portion of `text` revealed so far. */
  displayed: string;
  /** True once the full text has been revealed (or when animation is off). */
  done: boolean;
}

/**
 * Progressively reveals `text` like a chatbot typing. When `enabled` is false
 * (e.g. messages loaded from history) the full text is shown immediately.
 *
 * Speed scales with length so even long replies finish in a few seconds.
 * `onTick` fires on every reveal step (used to keep the view scrolled to the
 * bottom while typing).
 */
export function useTypewriter(
  text: string,
  enabled: boolean,
  onTick?: () => void,
): TypewriterResult {
  const [count, setCount] = useState(() => (enabled ? 0 : text.length));
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return undefined;
    }
    const total = text.length;
    setCount(0);
    if (total === 0) return undefined;

    // Slower, more natural typing: scales with length, capped so very long
    // replies don't drag on forever.
    const durationMs = Math.min(12000, Math.max(1800, total * 32));
    const intervalMs = 32;
    const step = Math.max(1, Math.ceil(total / (durationMs / intervalMs)));

    let current = 0;
    const id = setInterval(() => {
      current = Math.min(total, current + step);
      setCount(current);
      onTickRef.current?.();
      if (current >= total) clearInterval(id);
    }, intervalMs);

    return () => clearInterval(id);
  }, [text, enabled]);

  return { displayed: text.slice(0, count), done: count >= text.length };
}
