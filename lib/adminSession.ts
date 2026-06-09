export const ADMIN_SESSION_COOKIE = "afia_admin_session";

export async function computeSessionToken(password: string): Promise<string> {
  const salt = "afia-admin-session-v1";
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string | null> {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return null;
  return computeSessionToken(pwd);
}
