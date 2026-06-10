import { apiRequest } from "@/lib/web/api";
import type { ConsentState } from "./types";

/**
 * AI data-sharing consent (Gate A). These calls intentionally use apiRequest
 * (not aiFetch) — the consent endpoints themselves are never consent-gated.
 */

export async function getConsent(): Promise<ConsentState | null> {
  const res = await apiRequest<ConsentState>("/api/user/ai-consent");
  return res.ok ? res.data : null;
}

export async function acceptConsent(): Promise<ConsentState | null> {
  const res = await apiRequest<ConsentState>("/api/user/ai-consent", {
    method: "POST",
  });
  return res.ok ? res.data : null;
}

export async function revokeConsent(): Promise<ConsentState | null> {
  const res = await apiRequest<ConsentState>("/api/user/ai-consent/revoke", {
    method: "POST",
  });
  return res.ok ? res.data : null;
}
