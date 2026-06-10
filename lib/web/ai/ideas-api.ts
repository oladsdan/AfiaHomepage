import { aiFetch } from "./client";
import type {
  ContentIdea,
  HooksGenerateInput,
  IdeaGenerateInput,
} from "./types";

/**
 * Content Ideas + Hooks endpoints (02-ai-tools.md, Prompt 10).
 * Credits are charged/refunded SERVER-side — the client only triggers calls.
 */

/** Query key for the saved-ideas list (mirrors the GET path). */
export const SAVED_IDEAS_QUERY_KEY = ["/api/ideas/saved"] as const;

/** A saved idea; the server may store extra fields and a created timestamp. */
export interface SavedIdea extends ContentIdea {
  id: string;
  createdAt?: string;
}

// ---------------------------------------------------------------------------
// Normalisation helpers
// ---------------------------------------------------------------------------

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const list = value
    .filter((v) => v !== null && v !== undefined)
    .map((v) => (typeof v === "string" ? v : String(v)))
    .filter((v) => v.trim().length > 0);
  return list.length > 0 ? list : [];
}

/** Coerce a raw object into a ContentIdea, guaranteeing a usable title. */
function normalizeIdea(
  item: Record<string, unknown>,
  index: number,
): ContentIdea {
  const rawId = item.id ?? item._id;
  return {
    ...item,
    id: rawId !== undefined && rawId !== null ? String(rawId) : undefined,
    title:
      typeof item.title === "string" && item.title.trim()
        ? item.title
        : `Idea ${index + 1}`,
    description:
      typeof item.description === "string" ? item.description : undefined,
    hooks: toStringArray(item.hooks),
    videoStructure: toStringArray(item.videoStructure),
    whyThisWorks: toStringArray(item.whyThisWorks),
  };
}

function normalizeSavedIdea(
  item: Record<string, unknown>,
  index: number,
): SavedIdea {
  const idea = normalizeIdea(item, index);
  const rawId = item.id ?? item._id;
  return {
    ...idea,
    id:
      rawId !== undefined && rawId !== null ? String(rawId) : `saved-${index}`,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : undefined,
  };
}

/** Unwrap an array out of a possibly-nested envelope (data/ideas/saved/items). */
function unwrapList(body: unknown): unknown[] {
  let list: unknown = body;
  if (list && typeof list === "object" && !Array.isArray(list)) {
    const obj = list as Record<string, unknown>;
    list = obj.data ?? obj.ideas ?? obj.saved ?? obj.items ?? [];
    // The envelope's data may itself wrap the array.
    if (list && typeof list === "object" && !Array.isArray(list)) {
      const inner = list as Record<string, unknown>;
      list = inner.ideas ?? inner.items ?? inner.saved ?? [];
    }
  }
  return Array.isArray(list) ? list : [];
}

// ---------------------------------------------------------------------------
// Generate ideas (1 credit, server-side)
// ---------------------------------------------------------------------------

export async function generateIdeas(
  input: IdeaGenerateInput,
): Promise<ContentIdea[]> {
  const body = await aiFetch<{ success?: boolean; data?: unknown }>(
    "/api/ideas/generate",
    { method: "POST", body: input },
  );
  return unwrapList(body.data ?? body)
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object",
    )
    .map(normalizeIdea);
}

// ---------------------------------------------------------------------------
// Generate more hooks for an idea (1 credit, server-side)
// ---------------------------------------------------------------------------

export async function generateHooks(
  input: HooksGenerateInput,
): Promise<string[]> {
  const body = await aiFetch<{ success?: boolean; data?: unknown }>(
    "/api/ideas/generate-hooks",
    { method: "POST", body: input },
  );
  const raw = body.data ?? body;
  return toStringArray(unwrapList(raw)) ?? [];
}

// ---------------------------------------------------------------------------
// Saved ideas CRUD
// ---------------------------------------------------------------------------

export async function saveIdea(idea: ContentIdea): Promise<void> {
  await aiFetch<{ success?: boolean }>("/api/ideas/save", {
    method: "POST",
    body: idea,
  });
}

/** GET /api/ideas/saved — the list shape may vary; normalize defensively. */
export async function listSavedIdeas(): Promise<SavedIdea[]> {
  const body = await aiFetch<unknown>("/api/ideas/saved");
  return unwrapList(body)
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object",
    )
    .map(normalizeSavedIdea);
}

export async function deleteSavedIdea(id: string): Promise<void> {
  await aiFetch<{ success?: boolean }>(
    `/api/ideas/saved/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
