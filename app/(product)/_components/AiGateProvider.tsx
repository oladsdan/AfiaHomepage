"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { registerAiGateHandlers } from "@/lib/web/ai/client";
import {
  acceptConsent,
  getConsent,
  revokeConsent,
} from "@/lib/web/ai/consent-api";
import type { ConsentState, LimitInfo } from "@/lib/web/ai/types";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import { toast } from "@/lib/web/toast";
import { AiConsentModal } from "./AiConsentModal";
import { LimitPanel } from "./LimitPanel";

interface AiConsentContextValue {
  consent: ConsentState | null;
  refreshConsent: () => Promise<void>;
  revoke: () => Promise<void>;
}

const AiConsentContext = createContext<AiConsentContextValue | null>(null);

/** Consent state for settings UIs (view / revoke). */
export function useAiConsent(): AiConsentContextValue {
  const ctx = useContext(AiConsentContext);
  if (!ctx) {
    throw new Error("useAiConsent must be used within an AiGateProvider");
  }
  return ctx;
}

/**
 * Mounts the two global AI gates (02-ai-tools.md, Prompt 6):
 *  A) consent modal — opened when any AI call returns AI_CONSENT_REQUIRED;
 *     accepting POSTs consent and the original call is retried by the client.
 *  B) limit panel — opened on creditLimited / usageInfo 403s.
 */
export function AiGateProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [consentMessage, setConsentMessage] = useState<string | undefined>();
  const [consentBusy, setConsentBusy] = useState(false);
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);

  // Concurrent AI calls share a single consent prompt.
  const pendingConsent = useRef<{
    promise: Promise<boolean>;
    resolve: (accepted: boolean) => void;
  } | null>(null);

  const refreshConsent = useCallback(async () => {
    const state = await getConsent();
    if (state) setConsent(state);
  }, []);

  const revoke = useCallback(async () => {
    const state = await revokeConsent();
    if (state) {
      setConsent(state);
      toast("AI data sharing turned off.", "success");
    } else {
      toast("Couldn't update your consent. Please try again.", "error");
    }
  }, []);

  // Know the current consent state once logged in.
  useEffect(() => {
    if (isAuthenticated) void refreshConsent();
    else setConsent(null);
  }, [isAuthenticated, refreshConsent]);

  useEffect(() => {
    registerAiGateHandlers({
      requestConsent: (serverMessage) => {
        if (pendingConsent.current) return pendingConsent.current.promise;

        let resolve!: (accepted: boolean) => void;
        const promise = new Promise<boolean>((r) => {
          resolve = r;
        });
        pendingConsent.current = { promise, resolve };
        setConsentMessage(serverMessage);
        setConsentOpen(true);
        return promise;
      },
      showLimit: (info) => setLimitInfo(info),
    });
  }, []);

  const settleConsent = (accepted: boolean) => {
    pendingConsent.current?.resolve(accepted);
    pendingConsent.current = null;
    setConsentOpen(false);
    setConsentBusy(false);
  };

  const handleAccept = async () => {
    setConsentBusy(true);
    const state = await acceptConsent();
    if (state?.consented) {
      setConsent(state);
      settleConsent(true);
    } else {
      // Keep the modal open so the user can retry.
      setConsentBusy(false);
      toast("Couldn't save your consent. Please try again.", "error");
    }
  };

  const handleCancel = () => {
    // Reject gracefully — the original request resolves with its 403.
    settleConsent(false);
  };

  return (
    <AiConsentContext.Provider value={{ consent, refreshConsent, revoke }}>
      {children}
      <AiConsentModal
        open={consentOpen}
        serverMessage={consentMessage}
        busy={consentBusy}
        onAccept={handleAccept}
        onCancel={handleCancel}
      />
      <LimitPanel info={limitInfo} onClose={() => setLimitInfo(null)} />
    </AiConsentContext.Provider>
  );
}
