import "server-only";
import { api } from "@/lib/api";
import type { Activity, ActivityInput, ApiResponse, Paginated } from "@/types/api";

/**
 * GET /activities — public, paginated, sorted by date desc. No status/publish concept, so
 * this is the only list endpoint and it backs both the homepage "Upcoming Events" section
 * and the admin events page.
 */
export async function getActivities(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<Activity>>> {
  const res = await api.get<ApiResponse<Paginated<Activity>>>("/activities", {
    params: { page, limit },
  });
  return res.data;
}

/** POST /admin/activities — admin. */
export async function createActivity(
  input: ActivityInput,
): Promise<ApiResponse<Activity>> {
  const res = await api.post<ApiResponse<Activity>>("/admin/activities", input);
  return res.data;
}

/** PATCH /admin/activities/:id — admin. */
export async function updateActivity(
  id: string,
  input: Partial<ActivityInput>,
): Promise<ApiResponse<Activity>> {
  const res = await api.patch<ApiResponse<Activity>>(
    `/admin/activities/${id}`,
    input,
  );
  return res.data;
}

/** DELETE /admin/activities/:id — admin. */
export async function deleteActivity(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/admin/activities/${id}`);
  return res.data;
}
