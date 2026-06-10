import { aiFetch } from "./client";
import type {
  CaptionGenerateInput,
  CaptionOption,
  SavedCaption,
} from "./types";

/**
 * Caption Generator endpoints (02-ai-tools.md, Prompt 8).
 * Credits are charged/refunded SERVER-side — the client only triggers calls.
 */

/** Query key for the saved-captions list (mirrors the GET path). */
export const SAVED_CAPTIONS_QUERY_KEY = ["/api/captions/saved"] as const;

// ---------------------------------------------------------------------------
// Generate (1 credit, server-side)
// ---------------------------------------------------------------------------

export async function generateCaptions(
  input: CaptionGenerateInput,
): Promise<CaptionOption[]> {
  const body = await aiFetch<{ success?: boolean; data?: CaptionOption[] }>(
    "/api/captions/generate",
    { method: "POST", body: input },
  );
  const list = Array.isArray(body.data) ? body.data : [];
  // Defensive: guarantee a usable id + text on every option.
  return list
    .filter((item) => !!item && typeof item === "object")
    .map((item, index) => ({
      ...item,
      id: item.id !== undefined && item.id !== null ? String(item.id) : `caption-${index}`,
      text: typeof item.text === "string" ? item.text : "",
    }));
}

// ---------------------------------------------------------------------------
// Edit / refine (free)
// ---------------------------------------------------------------------------

export interface CaptionEditInput {
  originalCaption: string;
  editPrompt: string;
}

export async function editCaption(input: CaptionEditInput): Promise<string> {
  const body = await aiFetch<{ success?: boolean; data?: string }>(
    "/api/captions/edit",
    { method: "POST", body: input },
  );
  return typeof body.data === "string" ? body.data : "";
}

// ---------------------------------------------------------------------------
// Saved captions CRUD
// ---------------------------------------------------------------------------

export interface CaptionSaveInput {
  text: string;
  platforms: string[];
  style: string;
  audience: string;
}

export async function saveCaption(input: CaptionSaveInput): Promise<void> {
  await aiFetch<{ success?: boolean }>("/api/captions/save", {
    method: "POST",
    body: input,
  });
}

/** Returns the caption body text regardless of which field the server used. */
export function savedCaptionText(item: SavedCaption): string {
  if (typeof item.text === "string") return item.text;
  if (typeof item.caption === "string") return item.caption;
  return "";
}

function normalizeSavedItem(
  item: Record<string, unknown>,
  index: number,
): SavedCaption {
  const rawId = item.id ?? item._id;
  return {
    ...item,
    id:
      rawId !== undefined && rawId !== null
        ? String(rawId)
        : `saved-${index}`,
  } as SavedCaption;
}

/** GET /api/captions/saved — the list shape may vary; normalize defensively. */
export async function listSavedCaptions(): Promise<SavedCaption[]> {
  const body = await aiFetch<unknown>("/api/captions/saved");

  let list: unknown = body;
  if (list && typeof list === "object" && !Array.isArray(list)) {
    const obj = list as Record<string, unknown>;
    list = obj.data ?? obj.captions ?? obj.saved ?? obj.items ?? [];
    // The envelope's data may itself wrap the array.
    if (list && typeof list === "object" && !Array.isArray(list)) {
      const inner = list as Record<string, unknown>;
      list = inner.captions ?? inner.items ?? inner.saved ?? [];
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

export async function updateSavedCaption(
  id: string,
  updates: Partial<SavedCaption>,
): Promise<void> {
  await aiFetch<{ success?: boolean }>(
    `/api/captions/saved/${encodeURIComponent(id)}`,
    { method: "PUT", body: updates },
  );
}

export async function deleteSavedCaption(id: string): Promise<void> {
  await aiFetch<{ success?: boolean }>(
    `/api/captions/saved/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
