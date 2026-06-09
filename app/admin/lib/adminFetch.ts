import { toast } from "./toast";

export class AdminFetchError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "AdminFetchError";
  }
}

export async function adminFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, cache: "no-store" });
    console.log(res);
  } catch {
    const msg = "Network error — check your connection";
    toast(msg, "error");
    throw new AdminFetchError(0, msg);
  }

  let json: { success: boolean; data?: T; message?: string } | null = null;0
  try {
    json = await res.json();
  } catch {
    const msg = `Unexpected server response (${res.status})`;
    toast(msg, "error");
    throw new AdminFetchError(res.status, msg);
  }

  if (res.status === 429) {
    const retryAfter = res.headers.get("RateLimit-Reset");
    const seconds = retryAfter ? Number(retryAfter) : 60;
    const msg = `Rate limited — please wait ${seconds} second${seconds !== 1 ? "s" : ""} before retrying`;
    toast(msg, "warning", (seconds + 2) * 1000);
    throw new AdminFetchError(429, msg, seconds);
  }

  if (!res.ok || json?.success === false) {
    const msg = json?.message ?? `Request failed (${res.status})`;
    if (res.status !== 401) toast(msg, "error");
    throw new AdminFetchError(res.status, msg);
  }

  return json!.data as T;
}
