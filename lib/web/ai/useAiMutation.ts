"use client";

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "@/lib/web/toast";
import { AiError } from "./client";
import { useInvalidateUsage } from "./usage";

/**
 * Shows a toast for failed AI calls — unless the global gates (consent modal /
 * limit panel) already informed the user.
 */
export function showAiError(error: unknown): void {
  if (error instanceof AiError && error.handled) return;
  const message =
    error instanceof Error && error.message
      ? error.message
      : "Something went wrong. Please try again.";
  toast(message, "error");
}

/**
 * useMutation preconfigured for AI endpoints:
 *  - on success, invalidates GET /api/subscription/usage (credit balance);
 *  - on error, toasts the server message unless a gate already handled it.
 */
export function useAiMutation<TData = unknown, TVariables = void>(
  options: UseMutationOptions<TData, unknown, TVariables>,
): UseMutationResult<TData, unknown, TVariables> {
  const invalidateUsage = useInvalidateUsage();

  return useMutation<TData, unknown, TVariables>({
    ...options,
    onSuccess: (data, variables, context) => {
      invalidateUsage();
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      showAiError(error);
      options.onError?.(error, variables, context);
    },
  });
}
