import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, Feedback, FeedbackInput, Paginated } from "@/types/api";

/** POST /reviews/feedback — public, no auth. Private admin inbox, never shown publicly. */
export async function submitFeedback(
  input: FeedbackInput,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>("/reviews/feedback", input);
  return res.data;
}

/** GET /admin/reviews/feedback — admin. Private inbox, newest first. */
export async function getAllFeedback(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<Feedback>>> {
  const res = await api.get<ApiResponse<Paginated<Feedback>>>("/admin/reviews/feedback", {
    params: { page, limit },
  });
  return res.data;
}

/** DELETE /admin/reviews/feedback/:feedbackId — admin. Permanent. */
export async function deleteFeedback(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/admin/reviews/feedback/${id}`);
  return res.data;
}
