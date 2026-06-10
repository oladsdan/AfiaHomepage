import {
  apiRequest,
  type ApiResult,
  type RequestOptions,
} from "@/lib/web/api";
import type { LimitInfo, UsageInfo } from "./types";

/**
 * Gate-aware client for AI endpoints (02-ai-tools.md, Prompt 6).
 *
 * Every AI call passes through two gates:
 *  A) 403 { code: "AI_CONSENT_REQUIRED" }  → open the global consent modal;
 *     on accept the consent is POSTed and the original request retried.
 *  B) 403 { creditLimited: true } or { usageInfo } → open the global limit
 *     panel showing the server `message` verbatim.
 *
 * The AiGateProvider registers handlers here at mount.
 */

interface AiGateHandlers {
  /** Open the consent modal; resolve true once consent was granted. */
  requestConsent: (serverMessage?: string) => Promise<boolean>;
  /** Open the "limit reached" panel. */
  showLimit: (info: LimitInfo) => void;
}

let gateHandlers: AiGateHandlers | null = null;

export function registerAiGateHandlers(handlers: AiGateHandlers): void {
  gateHandlers = handlers;
}

export class AiError extends Error {
  status: number;
  code?: string;
  /**
   * True when the gate UI (consent modal / limit panel) already informed the
   * user — callers must NOT show an additional error toast.
   */
  handled: boolean;

  constructor(
    message: string,
    opts: { status: number; code?: string; handled?: boolean } = { status: 0 },
  ) {
    super(message);
    this.name = "AiError";
    this.status = opts.status;
    this.code = opts.code;
    this.handled = opts.handled ?? false;
  }
}

interface ErrorBody {
  success?: boolean;
  message?: string;
  code?: string;
  creditLimited?: boolean;
  usageInfo?: UsageInfo;
}

// ---------------------------------------------------------------------------
// Free-tier usage headers (X-Remaining-Uses etc.) — tiny pub/sub store
// ---------------------------------------------------------------------------

export interface FreeUsageHeaders {
  remainingUses?: number;
  usageLimit?: number;
  usageCount?: number;
  trialDaysRemaining?: number;
}

let lastFreeUsage: FreeUsageHeaders | null = null;
const usageListeners = new Set<(u: FreeUsageHeaders | null) => void>();

export function subscribeFreeUsage(
  fn: (u: FreeUsageHeaders | null) => void,
): () => void {
  usageListeners.add(fn);
  fn(lastFreeUsage);
  return () => {
    usageListeners.delete(fn);
  };
}

function captureUsageHeaders(headers?: Headers): void {
  if (!headers || !headers.has("X-Remaining-Uses")) return;
  const num = (name: string): number | undefined => {
    const raw = headers.get(name);
    const n = raw === null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };
  lastFreeUsage = {
    remainingUses: num("X-Remaining-Uses"),
    usageLimit: num("X-Usage-Limit"),
    usageCount: num("X-Usage-Count"),
    trialDaysRemaining: num("X-Trial-Days-Remaining"),
  };
  usageListeners.forEach((fn) => fn(lastFreeUsage));
}

// ---------------------------------------------------------------------------
// Core request wrappers
// ---------------------------------------------------------------------------

function isLimitBody(body: ErrorBody | null): body is ErrorBody {
  return !!body && (body.creditLimited === true || body.usageInfo !== undefined);
}

/**
 * apiRequest + the two AI gates. Returns the raw ApiResult; most callers want
 * {@link aiFetch} instead.
 */
export async function aiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  let res = await apiRequest<T>(path, options);

  if (res.status === 403) {
    const body = res.data as ErrorBody | null;
    if (body?.code === "AI_CONSENT_REQUIRED" && gateHandlers) {
      const accepted = await gateHandlers.requestConsent(body.message);
      if (accepted) {
        // Consent stored server-side — retry the original request.
        res = await apiRequest<T>(path, options);
      }
    }
  }

  // Re-check (the post-consent retry may hit the usage gate).
  if (res.status === 403) {
    const body = res.data as ErrorBody | null;
    if (isLimitBody(body)) {
      gateHandlers?.showLimit({
        message: body.message ?? "You've reached your usage limit.",
        creditLimited: body.creditLimited,
        usageInfo: body.usageInfo,
      });
    }
  }

  if (res.ok) captureUsageHeaders(res.headers);

  return res;
}

const STATUS_MESSAGES: Record<number, string> = {
  0: "Network error. Check your connection and try again.",
  401: "Your session has expired. Please log in again.",
  429: "Too many requests. Please try again in a moment.",
  500: "Something went wrong on our side. Please try again.",
};

/**
 * Gate-aware fetch that unwraps the response envelope and throws `AiError`
 * on failure. When the gates already informed the user, the thrown error has
 * `handled: true` so callers skip their own toast.
 */
export async function aiFetch<TBody = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<TBody> {
  const res = await aiRequest<TBody>(path, options);
  const body = res.data as (TBody & ErrorBody) | null;

  if (!res.ok || body?.success === false) {
    const handled =
      res.status === 403 &&
      (body?.code === "AI_CONSENT_REQUIRED" || isLimitBody(body ?? null));
    throw new AiError(
      body?.message ||
        STATUS_MESSAGES[res.status] ||
        "Request failed. Please try again.",
      { status: res.status, code: body?.code, handled },
    );
  }

  return body as TBody;
}
