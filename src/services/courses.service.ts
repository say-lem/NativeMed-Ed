import "server-only";
import { api } from "@/lib/api";
import type {
  AdminCourse,
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
): Promise<ApiResponse<Paginated<AdminCourse>>> {
  const res = await api.get<ApiResponse<Paginated<AdminCourse>>>(
    "/courses/admin/all",
    { params: { page, limit } },
  );
  return res.data;
}

/**
 * Fetch EVERY admin course across all pages. The backend caps `limit` at 50, so
 * a single request only returns the first 50 — anything after that (e.g. newly
 * added courses that sort to the end) would be invisible to the client-side
 * list. This pages through until all `totalPages` are collected.
 */
export async function getAllAdminCourses(): Promise<AdminCourse[]> {
  const first = await getAdminCourses(1, 50);
  if (!first.success) return [];

  const { items, totalPages } = first.data;
  const all = [...items];

  for (let page = 2; page <= totalPages; page++) {
    const res = await getAdminCourses(page, 50);
    if (res.success) all.push(...res.data.items);
  }

  return all;
}

/** GET /courses/admin/:id — admin only. Single course **incl. drafts**, and (since
 *  2026-08-10) **incl. the Drive folder links** — hence `AdminCourse`. Used for edit prefill. */
export async function getAdminCourse(
  id: string,
): Promise<ApiResponse<AdminCourse>> {
  const res = await api.get<ApiResponse<AdminCourse>>(`/courses/admin/${id}`);
  return res.data;
}

/** POST /courses — admin. Create a course. Requires both pricing tiers + both Drive links. */
export async function createCourse(
  payload: CourseInput,
): Promise<ApiResponse<AdminCourse>> {
  const res = await api.post<ApiResponse<AdminCourse>>("/courses", payload);
  return res.data;
}

/** PATCH /courses/:id — admin. Partial update; `pricing` merges per tier/interval, so send
 *  only what changed. Omitted Drive links keep their stored value. */
export async function updateCourse(
  id: string,
  payload: Partial<CourseInput>,
): Promise<ApiResponse<AdminCourse>> {
  const res = await api.patch<ApiResponse<AdminCourse>>(
    `/courses/${id}`,
    payload,
  );
  return res.data;
}

/** DELETE /courses/:id — admin. **Cascades** since 2026-08-10: deactivates every enrollment,
 *  revokes Drive access, and cancels Stripe billing for the course, then deletes it. */
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

/** PATCH /courses/:id/pause-payments — admin. Blocks new checkouts/plan changes without
 *  touching visibility; existing subscriptions are untouched. */
export async function pauseCoursePayments(
  id: string,
): Promise<ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>> {
  const res = await api.patch<
    ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>
  >(`/courses/${id}/pause-payments`);
  return res.data;
}

/** PATCH /courses/:id/resume-payments — admin. */
export async function resumeCoursePayments(
  id: string,
): Promise<ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>> {
  const res = await api.patch<
    ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>
  >(`/courses/${id}/resume-payments`);
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
