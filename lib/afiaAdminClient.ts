import "server-only";
import type {
  AdminUser,
  AdminUserDetail,
  UsersListResponse,
  StatsResponse,
  InspirationVideo,
  InspirationVideoPayload,
  RecentUsersResponse,
  BlockUserPayload,
  BlockUserResponse,
  AdjustCreditsPayload,
  AdjustCreditsResponse,
  RecentPaymentsResponse,
  SubscriptionOverview,
  RevenueSummary,
  RevenueTimeseriesResponse,
  RevenueBreakdownResponse,
  RevenueDailyBreakdownResponse,
} from "./types/admin";

function buildQs(params: Record<string, unknown>): string {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  return qs ? "?" + qs : "";
}

export class AfiaAdminError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "AfiaAdminError";
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://afia-mobile--zokulabs.replit.app";

const ADMIN_KEY = process.env.AFIA_ADMIN_API_KEY!;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/admin${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY,
        ...(init.headers ?? {}),
      },
    });
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof Error && e.name === "AbortError") {
      throw new AfiaAdminError(504, `AFIA API timeout after 15s: ${path}`);
    }
    throw new AfiaAdminError(502, `Network error: ${e instanceof Error ? e.message : "unknown"}`);
  }
  clearTimeout(timeout);

  let body: { success: boolean; data?: T; message?: string } | null = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON body */
  }

  if (!res.ok || body?.success === false) {
    const retryAfter = res.headers.get("RateLimit-Reset");
    throw new AfiaAdminError(
      res.status,
      body?.message ?? `Request failed: ${res.status}`,
      retryAfter ? Number(retryAfter) : undefined,
    );
  }

  return body!.data as T;
}

export const afiaAdmin = {
  getStats: () => request<StatsResponse>("/stats"),

  listUsers: (
    params: { page?: number; limit?: number; search?: string } = {},
  ) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)]),
    ).toString();
    return request<UsersListResponse>(`/users${qs ? "?" + qs : ""}`);
  },


  getUser: (id: string) => request<AdminUserDetail>(`/users/${id}`),

  deleteUser: (id: string) =>
    request<{ message: string }>(`/users/${id}`, { method: "DELETE" }),

  listInspirationVideos: () =>
    request<{ videos: InspirationVideo[] }>("/inspiration-videos"),

  createInspirationVideo: (body: InspirationVideoPayload) =>
    request<InspirationVideo>("/inspiration-videos", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateInspirationVideo: (
    id: string,
    body: Partial<InspirationVideoPayload>,
  ) =>
    request<InspirationVideo>(`/inspiration-videos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteInspirationVideo: (id: string) =>
    request<{ message: string }>(`/inspiration-videos/${id}`, {
      method: "DELETE",
    }),

  listRecentUsers: () => request<RecentUsersResponse>("/users/recent"),

  blockUser: (id: string, body: BlockUserPayload) =>
    request<BlockUserResponse>(`/users/${id}/block`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  adjustCredits: (id: string, body: AdjustCreditsPayload) =>
    request<AdjustCreditsResponse>(`/users/${id}/credits`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listRecentPayments: (params: { page?: number; limit?: number } = {}) =>
    request<RecentPaymentsResponse>(`/payments/recent${buildQs(params)}`),

  getSubscriptionOverview: () =>
    request<SubscriptionOverview>("/subscriptions/overview"),

  getRevenueSummary: (params: { from?: string; to?: string } = {}) =>
    request<RevenueSummary>(`/revenue/summary${buildQs(params)}`),

  getRevenueTimeseries: (
    params: {
      from?: string;
      to?: string;
      granularity?: "day" | "week" | "month";
    } = {},
  ) =>
    request<RevenueTimeseriesResponse>(
      `/revenue/timeseries${buildQs(params)}`,
    ),

  getRevenueBreakdown: (
    params: {
      dimension?: "plan" | "country" | "provider";
      from?: string;
      to?: string;
    } = {},
  ) =>
    request<RevenueBreakdownResponse>(
      `/revenue/breakdown${buildQs(params)}`,
    ),

  getRevenueDailyBreakdown: (
    params: {
      from?: string;
      to?: string;
      granularity?: "day" | "week" | "month";
    } = {},
  ) =>
    request<RevenueDailyBreakdownResponse>(
      `/revenue/breakdown${buildQs(params)}`,
    ),
};
