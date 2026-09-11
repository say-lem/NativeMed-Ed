import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, FeedbackInput } from "@/types/api";

/** POST /reviews/feedback — public, no auth. Private admin inbox, never shown publicly. */
export async function submitFeedback(
  input: FeedbackInput,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>("/reviews/feedback", input);
  return res.data;
}
