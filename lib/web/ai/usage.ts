"use client";

import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { apiRequest } from "@/lib/web/api";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import type { SubscriptionUsage } from "./types";

/** Query key mirrors the path per project convention. */
export const USAGE_QUERY_KEY = ["/api/subscription/usage"] as const;

export async function getUsage(): Promise<SubscriptionUsage | null> {
  const res = await apiRequest<SubscriptionUsage>("/api/subscription/usage");
  return res.ok ? res.data : null;
}

/**
 * Pro credit balance / monthly budget / next reset (or free-tier trial info).
 * Invalidate after every successful AI call via {@link useInvalidateUsage}.
 */
export function useUsage(): UseQueryResult<SubscriptionUsage | null> {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: USAGE_QUERY_KEY,
    queryFn: getUsage,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useInvalidateUsage(): () => void {
  const queryClient = useQueryClient();
  return useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY });
  }, [queryClient]);
}
