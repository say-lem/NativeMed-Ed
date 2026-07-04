import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, Course, CourseInput } from "@/types/api";

/** GET /courses — PUBLIC. Returns a plain array (NOT paginated): `data: Course[]`. */
export async function getCourses(): Promise<ApiResponse<Course[]>> {
  const res = await api.get<ApiResponse<Course[]>>("/courses");
  return res.data;
}

/** GET /courses/:id — auth. Single course. */
export async function getCourse(id: string): Promise<ApiResponse<Course>> {
  const res = await api.get<ApiResponse<Course>>(`/courses/${id}`);
  return res.data;
}

/** POST /courses — admin. Create a course. */
export async function createCourse(
  payload: CourseInput,
): Promise<ApiResponse<Course>> {
  const res = await api.post<ApiResponse<Course>>("/courses", payload);
  return res.data;
}

/** PATCH /courses/:id — admin. Partial update. */
export async function updateCourse(
  id: string,
  payload: Partial<CourseInput>,
): Promise<ApiResponse<Course>> {
  const res = await api.patch<ApiResponse<Course>>(`/courses/${id}`, payload);
  return res.data;
}

/** PATCH /courses/:id/publish — admin. Toggles published/draft. */
export async function publishCourse(
  id: string,
): Promise<ApiResponse<{ _id: string; title: string; isPublished: boolean }>> {
  const res = await api.patch<
    ApiResponse<{ _id: string; title: string; isPublished: boolean }>
  >(`/courses/${id}/publish`);
  return res.data;
}

/** PATCH /courses/:id/thumbnail — admin, multipart field `thumbnail`. */
export async function updateCourseThumbnail(
  id: string,
  file: File,
): Promise<ApiResponse<{ thumbnailUrl: string }>> {
  const fd = new FormData();
  fd.append("thumbnail", file);
  // Let axios derive the multipart boundary (override the JSON default).
  const res = await api.patch<ApiResponse<{ thumbnailUrl: string }>>(
    `/courses/${id}/thumbnail`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}
