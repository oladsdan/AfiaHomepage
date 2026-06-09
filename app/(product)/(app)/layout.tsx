import type { ReactNode } from "react";
import { ProtectedRoute } from "@/lib/web/auth/guards";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
