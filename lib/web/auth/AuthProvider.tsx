"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  refreshSession,
  registerAuthHandlers,
  request,
  setAccessToken,
  setLoggingOut,
} from "@/lib/web/api";
import type { WebUser } from "./types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: WebUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  setSession: (user: WebUser, accessToken: string) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WebUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const setSession = (nextUser: WebUser, token: string) => {
    setAccessToken(token);
    setUser(nextUser);
    setStatus("authenticated");
  };

  const clearSession = () => {
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  const logout = async () => {
    setLoggingOut(true);
    clearSession();
    try {
      await request("/api/auth/logout", { method: "POST", auth: false });
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    registerAuthHandlers({
      onRefreshed: (nextUser, token) => {
        setAccessToken(token);
        setUser(nextUser);
        setStatus("authenticated");
      },
      onSessionExpired: () => {
        setAccessToken(null);
        setUser(null);
        setStatus("unauthenticated");
      },
    });
    void refreshSession();
  }, []);

  const value: AuthContextValue = {
    user,
    status,
    isAuthenticated: status === "authenticated",
    setSession,
    clearSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
