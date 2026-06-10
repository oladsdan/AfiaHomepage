import type { AuthResponse, WebUser } from "./auth/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://afia-mobile--zokulabs.replit.app";

/** Absolute API origin, used to resolve relative media URLs (thumbnails, frames). */
export function getApiBaseUrl(): string {
  return API_BASE_URL.replace(/\/+$/, "");
}

let accessToken: string | null = null;
let loggingOut = false;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setLoggingOut(value: boolean): void {
  loggingOut = value;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  /** Response headers (absent on network failure). */
  headers?: Headers;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const { body, headers, auth = true, ...rest } = options;

  const finalHeaders = new Headers(headers as HeadersInit | undefined);
  let finalBody: BodyInit | undefined;
  if (body instanceof FormData) {
    // Let the browser set the multipart boundary — never set Content-Type.
    finalBody = body;
  } else if (body !== undefined && body !== null) {
    finalHeaders.set("Content-Type", "application/json");
    finalBody = JSON.stringify(body);
  }
  if (auth && accessToken) {
    finalHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: finalBody,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 0, data: null };
  }

  let data: T | null = null;
  try {
    data = (await res.json()) as T;
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, data, headers: res.headers };
}

interface AuthHandlers {
  onRefreshed: (user: WebUser | null, token: string) => void;
  onSessionExpired: () => void;
}

let authHandlers: AuthHandlers | null = null;

export function registerAuthHandlers(handlers: AuthHandlers): void {
  authHandlers = handlers;
}

let refreshPromise: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await request<AuthResponse>("/api/auth/refresh", {
        method: "POST",
        auth: false,
      });
      if (
        res.ok &&
        res.data?.success &&
        res.data.tokens?.accessToken &&
        !loggingOut
      ) {
        const token = res.data.tokens.accessToken;
        setAccessToken(token);
        authHandlers?.onRefreshed(res.data.user ?? null, token);
        return true;
      }
      setAccessToken(null);
      authHandlers?.onSessionExpired();
      return false;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  let res = await request<T>(path, options);
  if (res.status === 401 && options.auth !== false) {
    const refreshed = await refreshSession();
    if (refreshed) {
      res = await request<T>(path, options);
    }
  }
  return res;
}
