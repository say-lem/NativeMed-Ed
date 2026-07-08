import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, Enrollment, Paginated } from "@/types/api";

/** GET /enrollments — admin. May be a plain array or a paginated envelope (unverified). */
export async function getEnrollments(
  page = 1,
  limit = 50,
): Promise<ApiResponse<Enrollment[] | Paginated<Enrollment>>> {
  const res = await api.get<ApiResponse<Enrollment[] | Paginated<Enrollment>>>(
    "/enrollments",
    { params: { page, limit } },
  );
  return res.data;
}

/** POST /enrollments/manual — admin. Grant a user access to a course. */
export async function manualEnroll(
  userId: string,
  courseId: string,
): Promise<ApiResponse<Enrollment>> {
  const res = await api.post<ApiResponse<Enrollment>>("/enrollments/manual", {
    userId,
    courseId,
  });
  return res.data;
}

/** POST /enrollments/revoke — admin. Revoke a user's access to a course. */
export async function revokeEnroll(
  userId: string,
  courseId: string,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>("/enrollments/revoke", {
    userId,
    courseId,
  });
  return res.data;
}

/** PATCH /enrollments/:id/restore — admin. Restore a revoked enrollment. */
export async function restoreEnroll(
  id: string,
): Promise<ApiResponse<Enrollment>> {
  const res = await api.patch<ApiResponse<Enrollment>>(
    `/enrollments/${id}/restore`,
  );
  return res.data;
}
