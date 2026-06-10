/** A message in the local chat thread (mirrors the server CoachMessage). */
export interface ChatMessage {
  /** Local id (stable across renders) used as the React key. */
  id: string;
  role: "user" | "assistant";
  content: string;
  /** True while the user message's send is in flight or failed. */
  status?: "sending" | "failed";
}
