"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Gem, X, Zap } from "lucide-react";
import type { LimitInfo } from "@/lib/web/ai/types";

/**
 * Global "limit reached" panel (Gate B). Shows the server `message` VERBATIM.
 * Pro (creditLimited): buy a top-up / manage plan. Free (usageInfo): upgrade.
 * CTAs route to /settings until the Stripe flow (03-payments-stripe.md) lands.
 */
export function LimitPanel({
  info,
  onClose,
}: {
  info: LimitInfo | null;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!info) return null;

  const isPro = info.creditLimited === true;
  const usage = info.usageInfo;

  const go = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="limit-panel-title"
      aria-describedby="limit-panel-message"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-dash-lg border border-dash-border bg-dash-surface p-6 shadow-dash-md">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1 text-dash-muted transition-colors hover:bg-dash-bg hover:text-dash-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <Zap className="h-6 w-6" aria-hidden="true" />
        </span>

        <h2
          id="limit-panel-title"
          className="mt-4 text-lg font-bold text-dash-ink"
        >
          {isPro ? "You're out of credits" : "Limit reached"}
        </h2>

        {/* Server message — rendered verbatim per spec. */}
        <p
          id="limit-panel-message"
          className="mt-2 text-sm leading-relaxed text-dash-muted"
        >
          {info.message}
        </p>

        {usage && (
          <div className="mt-4 space-y-1.5 rounded-dash bg-dash-bg p-3 text-xs text-dash-muted">
            {usage.limit !== undefined && (
              <p>
                Daily usage{usage.feature ? ` — ${usage.feature}` : ""}:{" "}
                <span className="font-semibold text-dash-ink">
                  {usage.used ?? 0}/{usage.limit}
                </span>
                {usage.remaining !== undefined && ` (${usage.remaining} left)`}
              </p>
            )}
            {usage.trialExpired ? (
              <p className="font-medium text-red-600">
                Your free trial has ended.
              </p>
            ) : (
              usage.trialDaysRemaining !== undefined && (
                <p>
                  Trial days remaining:{" "}
                  <span className="font-semibold text-dash-ink">
                    {usage.trialDaysRemaining}
                  </span>
                </p>
              )
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {isPro ? (
            <>
              <button
                type="button"
                onClick={() => go("/settings")}
                className="inline-flex items-center justify-center gap-2 rounded-dash bg-dash-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dash-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Buy a credit top-up
              </button>
              <button
                type="button"
                onClick={() => go("/settings")}
                className="rounded-dash border border-dash-border bg-dash-surface px-4 py-2.5 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand"
              >
                Manage plan
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => go("/settings")}
              className="inline-flex items-center justify-center gap-2 rounded-dash bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-dash-md transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand focus-visible:ring-offset-2"
            >
              <Gem className="h-4 w-4" aria-hidden="true" />
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
