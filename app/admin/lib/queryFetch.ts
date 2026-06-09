export class AdminQueryError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "AdminQueryError";
  }
}

function mapStatus(status: number, fallback: string): string {
  if (status === 401) return "Invalid admin API key";
  if (status === 503) return "Admin API key not configured";
  if (status === 429) return "Rate limited — refresh in a moment";
  if (status === 504) return "AFIA API timed out";
  if (status === 502) return "AFIA API unreachable";
  return fallback;
}

export async function queryFetch<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", credentials: "include" });
  } catch {
    throw new AdminQueryError(0, "Network error");
  }

  let body: { success?: boolean; data?: T; message?: string } | null = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON */
  }

  if (!res.ok || body?.success === false) {
    const fallback = body?.message ?? `Request failed (${res.status})`;
    throw new AdminQueryError(res.status, mapStatus(res.status, fallback));
  }

  return body!.data as T;
}

export function errorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (error instanceof AdminQueryError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to load";
}
