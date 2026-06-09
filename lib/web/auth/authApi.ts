import { request } from "@/lib/web/api";
import type { AuthResponse, WebUser } from "./types";

export class AuthError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export interface AuthSuccess {
  user: WebUser;
  accessToken: string;
}

const NETWORK_MESSAGE = "Can't reach the server. Please try again.";
const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export async function signup(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthSuccess> {
  const res = await request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    auth: false,
    body: input,
  });

  if (res.ok && res.data?.user && res.data.tokens?.accessToken) {
    return { user: res.data.user, accessToken: res.data.tokens.accessToken };
  }
  if (res.status === 0) throw new AuthError(NETWORK_MESSAGE);
  if (res.status === 400) {
    throw new AuthError(res.data?.message ?? "Please check your details and try again.");
  }
  throw new AuthError(res.data?.message ?? GENERIC_MESSAGE);
}

export async function login(
  email: string,
  password: string,
): Promise<AuthSuccess> {
  const res = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });

  if (res.ok && res.data?.user && res.data.tokens?.accessToken) {
    return { user: res.data.user, accessToken: res.data.tokens.accessToken };
  }
  if (res.status === 0) throw new AuthError(NETWORK_MESSAGE);
  if (res.status === 401) throw new AuthError("Incorrect email or password");
  if (res.status === 403 && res.data?.code === "ACCOUNT_BLOCKED") {
    throw new AuthError(
      res.data.message ?? "Your account has been blocked.",
      "ACCOUNT_BLOCKED",
    );
  }
  throw new AuthError(res.data?.message ?? GENERIC_MESSAGE);
}

export async function forgotPassword(email: string): Promise<void> {
  // The server intentionally returns the same outcome whether or not the email
  // exists, so we never branch on the response.
  await request("/api/auth/forgot-password", {
    method: "POST",
    auth: false,
    body: { email },
  });
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  const res = await request<AuthResponse>("/api/auth/reset-password", {
    method: "POST",
    auth: false,
    body: { token, newPassword },
  });

  if (res.ok && res.data?.success !== false) return;
  if (res.status === 0) throw new AuthError(NETWORK_MESSAGE);
  throw new AuthError(
    res.data?.message ?? "This reset link is invalid or has expired.",
  );
}
