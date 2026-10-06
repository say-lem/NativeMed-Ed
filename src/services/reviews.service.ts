import "server-only";
import { api } from "@/lib/api";
import type {
  AdminReview,
  ApiResponse,
  Paginated,
  Review,
  ReviewInput,
  ReviewStatus,
} from "@/types/api";

/** GET /reviews — public, paginated, approved-only. Backs the homepage testimonials. */
export async function getReviews(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<Review>>> {
  const res = await api.get<ApiResponse<Paginated<Review>>>("/reviews", {
    params: { page, limit },
  });
  return res.data;
}

/** POST /reviews — public, no auth. Always lands as "pending" awaiting admin approval. */
export async function submitReview(
  input: ReviewInput,
): Promise<ApiResponse<Review>> {
  const res = await api.post<ApiResponse<Review>>("/reviews", input);
  return res.data;
}

/** GET /admin/reviews — admin. Every status; filter with `status`. */
export async function getAdminReviews(
  status?: ReviewStatus,
  page = 1,
  limit = 100,
): Promise<ApiResponse<Paginated<AdminReview>>> {
  const res = await api.get<ApiResponse<Paginated<AdminReview>>>(
    "/admin/reviews",
    { params: { status, page, limit } },
  );
  return res.data;
}

/** PATCH /admin/reviews/:id/approve — admin. Makes a pending/revoked review public. */
export async function approveReview(
  id: string,
): Promise<ApiResponse<AdminReview>> {
  const res = await api.patch<ApiResponse<AdminReview>>(
    `/admin/reviews/${id}/approve`,
  );
  return res.data;
}

/** PATCH /admin/reviews/:id/revoke — admin. Pulls an approved review from the public feed. */
export async function revokeReview(
  id: string,
): Promise<ApiResponse<AdminReview>> {
  const res = await api.patch<ApiResponse<AdminReview>>(
    `/admin/reviews/${id}/revoke`,
  );
  return res.data;
}

/** DELETE /admin/reviews/:id — admin. Permanent. */
export async function deleteReview(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/admin/reviews/${id}`);
  return res.data;
}

/** PATCH /admin/reviews/:id — admin. Edit content; backend 400s unless the review is still "pending". */
export async function updateReview(
  id: string,
  input: Partial<ReviewInput>,
): Promise<ApiResponse<AdminReview>> {
  const res = await api.patch<ApiResponse<AdminReview>>(
    `/admin/reviews/${id}`,
    input,
  );
  return res.data;
}
