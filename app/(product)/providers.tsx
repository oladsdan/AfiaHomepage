"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/web/auth/AuthProvider";
import { AiGateProvider } from "./_components/AiGateProvider";
import { Toaster } from "./_components/Toaster";

export function WebProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <AiGateProvider>
          {children}
          <Toaster />
        </AiGateProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
