import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  Course,
  CourseInput,
  Lesson,
  Paginated,
} from "@/types/api";

/** GET /courses — PUBLIC, **published-only**. Plain array (NOT paginated): `data: Course[]`. */
export async function getCourses(): Promise<ApiResponse<Course[]>> {
  const res = await api.get<ApiResponse<Course[]>>("/courses");
  return res.data;
}

/** GET /courses/:id — auth, **published-only**. Single course. */
export async function getCourse(id: string): Promise<ApiResponse<Course>> {
  const res = await api.get<ApiResponse<Course>>(`/courses/${id}`);
  return res.data;
}

/** GET /courses/admin/all — admin only. **Paginated, incl. drafts.** Use for the admin list. */
export async function getAdminCourses(
  page = 1,
  limit = 50,
): Promise<ApiResponse<Paginated<Course>>> {
  const res = await api.get<ApiResponse<Paginated<Course>>>(
    "/courses/admin/all",
    { params: { page, limit } },
  );
  return res.data;
}

/** GET /courses/admin/:id — admin only. Single course **incl. drafts.** Use for edit prefill. */
export async function getAdminCourse(
  id: string,
): Promise<ApiResponse<Course>> {
  const res = await api.get<ApiResponse<Course>>(`/courses/admin/${id}`);
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

/** DELETE /courses/:id — admin. Hard delete (also removes the Cloudinary thumbnail). */
export async function deleteCourse(
  id: string,
): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/courses/${id}`);
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

/* ------------------------------------------------------------------ *
 * Course Content (lessons) — /courses/:courseId/content
 * ------------------------------------------------------------------ */

/** GET /courses/:courseId/content — admin. All lessons for a course. */
export async function getCourseContent(
  courseId: string,
): Promise<ApiResponse<Lesson[]>> {
  const res = await api.get<ApiResponse<Lesson[]>>(
    `/courses/${courseId}/content`,
  );
  return res.data;
}

/** POST /courses/:courseId/content/upload-pdf — admin, multipart. A PDF lesson (Cloudinary). */
export async function uploadPdfLesson(
  courseId: string,
  payload: { file: File; title: string; order: number },
): Promise<ApiResponse<Lesson>> {
  const fd = new FormData();
  fd.append("file", payload.file);
  fd.append("title", payload.title);
  fd.append("order", String(payload.order));
  fd.append("type", "pdf");
  const res = await api.post<ApiResponse<Lesson>>(
    `/courses/${courseId}/content/upload-pdf`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/** POST /courses/:courseId/content/drive-link — admin, JSON. A video lesson (Google-Drive link). */
export async function addDriveLesson(
  courseId: string,
  payload: {
    title: string;
    fileUrl: string;
    order: number;
    duration?: string;
    type?: string;
  },
): Promise<ApiResponse<Lesson>> {
  const res = await api.post<ApiResponse<Lesson>>(
    `/courses/${courseId}/content/drive-link`,
    { type: "video", ...payload },
  );
  return res.data;
}

/** PATCH /courses/:courseId/content/:id — admin. Partial lesson update. */
export async function updateLesson(
  courseId: string,
  id: string,
  payload: Partial<Pick<Lesson, "title" | "order" | "duration" | "fileUrl">>,
): Promise<ApiResponse<Lesson>> {
  const res = await api.patch<ApiResponse<Lesson>>(
    `/courses/${courseId}/content/${id}`,
    payload,
  );
  return res.data;
}

/** DELETE /courses/:courseId/content/:id — admin. Remove a lesson. */
export async function deleteLesson(
  courseId: string,
  id: string,
): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(
    `/courses/${courseId}/content/${id}`,
  );
  return res.data;
}
