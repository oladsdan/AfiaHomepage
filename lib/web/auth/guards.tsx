"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
      <Loader2 className="w-6 h-6 animate-spin text-[#0FA37F]" />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") return <AuthLoading />;
  if (status !== "authenticated") return null;
  return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return <AuthLoading />;
  if (status === "authenticated") return null;
  return <>{children}</>;
}
