import { aiFetch } from "./client";
import type { GeneratedScript, ScriptGenerateInput } from "./types";

/**
 * Script Generator endpoints (02-ai-tools.md, Prompt 9).
 * Credits are charged/refunded SERVER-side — the client only triggers calls.
 */

/** Query key for the saved-scripts list (mirrors the GET path). */
export const SAVED_SCRIPTS_QUERY_KEY = ["/api/scripts/saved"] as const;

/** Item from GET /api/scripts/saved (shape tolerated loosely). */
export interface SavedScript {
  id: string;
  title?: string;
  type?: string;
  /** Markdown body. */
  content?: string;
  hookLine?: string;
  estimatedDuration?: string | number;
  createdAt?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Generate (1 credit, server-side)
// ---------------------------------------------------------------------------

export async function generateScript(
  input: ScriptGenerateInput,
): Promise<GeneratedScript> {
  const body = await aiFetch<{ success?: boolean; data?: GeneratedScript }>(
    "/api/scripts/generate",
    { method: "POST", body: input },
  );
  const script = body.data;
  if (!script || typeof script !== "object") {
    throw new Error("No script came back. Please try again.");
  }
  // Defensive: guarantee a usable id + markdown content string.
  return {
    ...script,
    id:
      script.id !== undefined && script.id !== null
        ? String(script.id)
        : `script-${Date.now()}`,
    content: typeof script.content === "string" ? script.content : "",
  };
}

// ---------------------------------------------------------------------------
// Saved scripts CRUD
// ---------------------------------------------------------------------------

export async function saveScript(script: GeneratedScript): Promise<void> {
  await aiFetch<{ success?: boolean }>("/api/scripts/save", {
    method: "POST",
    body: script,
  });
}

/** Returns the markdown body of a saved script regardless of field naming. */
export function savedScriptContent(item: SavedScript): string {
  if (typeof item.content === "string") return item.content;
  if (typeof item.script === "string") return item.script;
  return "";
}

function normalizeSavedItem(
  item: Record<string, unknown>,
  index: number,
): SavedScript {
  const rawId = item.id ?? item._id;
  return {
    ...item,
    id:
      rawId !== undefined && rawId !== null ? String(rawId) : `saved-${index}`,
  } as SavedScript;
}

/** GET /api/scripts/saved — the list shape may vary; normalize defensively. */
export async function listSavedScripts(): Promise<SavedScript[]> {
  const body = await aiFetch<unknown>("/api/scripts/saved");

  let list: unknown = body;
  if (list && typeof list === "object" && !Array.isArray(list)) {
    const obj = list as Record<string, unknown>;
    list = obj.data ?? obj.scripts ?? obj.saved ?? obj.items ?? [];
    // The envelope's data may itself wrap the array.
    if (list && typeof list === "object" && !Array.isArray(list)) {
      const inner = list as Record<string, unknown>;
      list = inner.scripts ?? inner.items ?? inner.saved ?? [];
    }
  }
  if (!Array.isArray(list)) return [];

  return list
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object",
    )
    .map(normalizeSavedItem);
}

export async function deleteSavedScript(id: string): Promise<void> {
  await aiFetch<{ success?: boolean }>(
    `/api/scripts/saved/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
