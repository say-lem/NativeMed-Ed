import "server-only";
import { api } from "@/lib/api";
import type { Activity, ActivityInput, ApiResponse, Paginated } from "@/types/api";

/** Public feed includes published events only. */
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

/** Admin feed includes unpublished events. */
export async function getAdminActivities(page = 1, limit = 50): Promise<ApiResponse<Paginated<Activity>>> {
  const res = await api.get<ApiResponse<Paginated<Activity>>>("/admin/activities", { params: { page, limit } });
  return res.data;
}

/** Publish or archive an event without changing its content. */
export async function setActivityPublished(id: string, isPublished: boolean): Promise<ApiResponse<Activity>> {
  const res = await api.patch<ApiResponse<Activity>>(`/admin/activities/${id}/${isPublished ? "publish" : "archive"}`);
  return res.data;
}
