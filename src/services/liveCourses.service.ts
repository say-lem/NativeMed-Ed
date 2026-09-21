import "server-only";
import { api } from "@/lib/api";
import * as content from "./content.service";
import type {
  AdminLiveCourse,
  ApiResponse,
  EnrollmentCheck,
  Lesson,
  LiveCourse,
  LiveCourseEnrollment,
  LiveCourseInput,
  Paginated,
} from "@/types/api";

/* ------------------------------------------------------------------ *
 * Public / user reads
 * ------------------------------------------------------------------ */

/** GET /live-courses — PUBLIC, published-only. Plain array (NOT paginated). */
export async function getLiveCourses(): Promise<ApiResponse<LiveCourse[]>> {
  const res = await api.get<ApiResponse<LiveCourse[]>>("/live-courses");
  return res.data;
}

/** GET /live-courses/:id — PUBLIC, published-only. Single live course. */
export async function getLiveCourse(id: string): Promise<ApiResponse<LiveCourse>> {
  const res = await api.get<ApiResponse<LiveCourse>>(`/live-courses/${id}`);
  return res.data;
}

/** GET /live-courses/:id/check — auth. Has the signed-in user purchased/been granted
 *  access to this live course? */
export async function checkLiveCourseEnrollment(
  id: string,
): Promise<ApiResponse<EnrollmentCheck>> {
  const res = await api.get<ApiResponse<EnrollmentCheck>>(`/live-courses/${id}/check`);
  return res.data;
}

/** GET /live-courses/me/enrollments — auth. The signed-in user's live-course purchases. */
export async function getMyLiveCourseEnrollments(): Promise<
  ApiResponse<LiveCourseEnrollment[]>
> {
  const res = await api.get<ApiResponse<LiveCourseEnrollment[]>>(
    "/live-courses/me/enrollments",
  );
  return res.data;
}

/* ------------------------------------------------------------------ *
 * Purchase — one-time Stripe Checkout (NOT the subscription /payments/checkout flow)
 * ------------------------------------------------------------------ */

/** POST /live-courses/:id/purchase — auth. Creates a one-time Stripe Checkout session.
 *  409 if already purchased/enrolled, 400 if unpublished/paused/ended. */
export async function purchaseLiveCourse(
  id: string,
  payload: { successUrl?: string; cancelUrl?: string },
): Promise<ApiResponse<{ sessionId: string; url: string }>> {
  const res = await api.post<ApiResponse<{ sessionId: string; url: string }>>(
    `/live-courses/${id}/purchase`,
    payload,
  );
  return res.data;
}

/* ------------------------------------------------------------------ *
 * Admin — CRUD
 * ------------------------------------------------------------------ */

/** GET /live-courses/admin/all — admin only. Paginated, incl. drafts. */
export async function getAdminLiveCourses(
  page = 1,
  limit = 50,
): Promise<ApiResponse<Paginated<AdminLiveCourse>>> {
  const res = await api.get<ApiResponse<Paginated<AdminLiveCourse>>>(
    "/live-courses/admin/all",
    { params: { page, limit } },
  );
  return res.data;
}

/** Fetch EVERY admin live course across all pages — same pagination pattern as
 *  `getAllAdminCourses`. */
export async function getAllAdminLiveCourses(): Promise<AdminLiveCourse[]> {
  const first = await getAdminLiveCourses(1, 50);
  if (!first.success) return [];

  const { items, totalPages } = first.data;
  const all = [...items];
  for (let page = 2; page <= totalPages; page++) {
    const res = await getAdminLiveCourses(page, 50);
    if (res.success) all.push(...res.data.items);
  }
  return all;
}

/** GET /live-courses/admin/:id — admin only. Incl. the Drive folder id, for edit prefill. */
export async function getAdminLiveCourse(
  id: string,
): Promise<ApiResponse<AdminLiveCourse>> {
  const res = await api.get<ApiResponse<AdminLiveCourse>>(`/live-courses/admin/${id}`);
  return res.data;
}

/** POST /live-courses — admin. Requires title, description, price, startDate, endDate,
 *  and the Drive link. */
export async function createLiveCourse(
  payload: LiveCourseInput,
): Promise<ApiResponse<AdminLiveCourse>> {
  const res = await api.post<ApiResponse<AdminLiveCourse>>("/live-courses", payload);
  return res.data;
}

/** PATCH /live-courses/:id — admin. Partial update. */
export async function updateLiveCourse(
  id: string,
  payload: Partial<LiveCourseInput>,
): Promise<ApiResponse<AdminLiveCourse>> {
  const res = await api.patch<ApiResponse<AdminLiveCourse>>(
    `/live-courses/${id}`,
    payload,
  );
  return res.data;
}

/** DELETE /live-courses/:id — admin. Cascades: revokes every enrollment's Drive access
 *  and deletes the enrollment records, then the course. No subscription to cancel. */
export async function deleteLiveCourse(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/live-courses/${id}`);
  return res.data;
}

/** PATCH /live-courses/:id/publish — admin. Toggles published/draft. */
export async function publishLiveCourse(
  id: string,
): Promise<ApiResponse<{ _id: string; title: string; isPublished: boolean }>> {
  const res = await api.patch<
    ApiResponse<{ _id: string; title: string; isPublished: boolean }>
  >(`/live-courses/${id}/publish`);
  return res.data;
}

/** PATCH /live-courses/:id/pause-payments — admin. Blocks new purchases without touching
 *  visibility; existing enrollments are untouched. */
export async function pauseLiveCoursePayments(
  id: string,
): Promise<ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>> {
  const res = await api.patch<
    ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>
  >(`/live-courses/${id}/pause-payments`);
  return res.data;
}

/** PATCH /live-courses/:id/resume-payments — admin. */
export async function resumeLiveCoursePayments(
  id: string,
): Promise<ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>> {
  const res = await api.patch<
    ApiResponse<{ _id: string; title: string; paymentsPaused: boolean }>
  >(`/live-courses/${id}/resume-payments`);
  return res.data;
}

/** POST /live-courses/:id/end — admin. Revokes every currently-active enrollment's Drive
 *  access and marks them inactive. The course itself stays as-is (still listed, still
 *  purchasable unless separately unpublished/paused). */
export async function endLiveCourse(id: string): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>(`/live-courses/${id}/end`);
  return res.data;
}

/** PATCH /live-courses/:id/thumbnail — admin, multipart field `thumbnail`. */
export async function updateLiveCourseThumbnail(
  id: string,
  file: File,
): Promise<ApiResponse<{ thumbnailUrl: string }>> {
  const fd = new FormData();
  fd.append("thumbnail", file);
  const res = await api.patch<ApiResponse<{ thumbnailUrl: string }>>(
    `/live-courses/${id}/thumbnail`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/** PATCH /live-courses/:id/toc-pdf — admin, multipart field `tocPdf` (PDF only, max 50MB).
 *  Sets/replaces the course-schedule PDF shown on the detail page. */
export async function updateLiveCourseTocPdf(
  id: string,
  file: File,
): Promise<ApiResponse<{ tocPdfUrl: string }>> {
  const fd = new FormData();
  fd.append("tocPdf", file);
  const res = await api.patch<ApiResponse<{ tocPdfUrl: string }>>(
    `/live-courses/${id}/toc-pdf`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/* ------------------------------------------------------------------ *
 * Admin — enrollments (roster is per-course; there's no global list like
 * /enrollments — see GET /live-courses/:id/enrollments)
 * ------------------------------------------------------------------ */

/** GET /live-courses/:id/enrollments — admin. Paginated roster for one course. */
export async function getLiveCourseEnrollments(
  courseId: string,
  page = 1,
  limit = 50,
): Promise<ApiResponse<Paginated<LiveCourseEnrollment>>> {
  const res = await api.get<ApiResponse<Paginated<LiveCourseEnrollment>>>(
    `/live-courses/${courseId}/enrollments`,
    { params: { page, limit } },
  );
  return res.data;
}

/** Fetch every enrollment for a course across all pages. */
export async function getAllLiveCourseEnrollments(
  courseId: string,
): Promise<LiveCourseEnrollment[]> {
  const first = await getLiveCourseEnrollments(courseId, 1, 50);
  if (!first.success) return [];

  const { items, totalPages } = first.data;
  const all = [...items];
  for (let page = 2; page <= totalPages; page++) {
    const res = await getLiveCourseEnrollments(courseId, page, 50);
    if (res.success) all.push(...res.data.items);
  }
  return all;
}

/** POST /live-courses/:id/enroll — admin. Grant a user access without payment. */
export async function manualEnrollLiveCourse(
  courseId: string,
  userId: string,
): Promise<ApiResponse<LiveCourseEnrollment>> {
  const res = await api.post<ApiResponse<LiveCourseEnrollment>>(
    `/live-courses/${courseId}/enroll`,
    { userId },
  );
  return res.data;
}

/** POST /live-courses/:id/revoke — admin. Revoke a user's access. */
export async function revokeLiveCourseEnrollment(
  courseId: string,
  userId: string,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>(`/live-courses/${courseId}/revoke`, {
    userId,
  });
  return res.data;
}

/** PATCH /live-courses/enrollments/:enrollmentId/restore — admin. Note: flat path, not
 *  nested under the course id. */
export async function restoreLiveCourseEnrollment(
  enrollmentId: string,
): Promise<ApiResponse<LiveCourseEnrollment>> {
  const res = await api.patch<ApiResponse<LiveCourseEnrollment>>(
    `/live-courses/enrollments/${enrollmentId}/restore`,
  );
  return res.data;
}

/* ------------------------------------------------------------------ *
 * Content (lessons) — /live-courses/:courseId/content
 * Thin bindings over the generic `content.service.ts` (same backend module as
 * regular courses, different base path).
 * ------------------------------------------------------------------ */

export const getLiveCourseContent = (courseId: string): Promise<ApiResponse<Lesson[]>> =>
  content.getCourseContent("live-courses", courseId);

export const uploadLiveCoursePdfLesson = (
  courseId: string,
  payload: { file: File; title: string; order: number },
): Promise<ApiResponse<Lesson>> =>
  content.uploadPdfLesson("live-courses", courseId, payload);

export const addLiveCourseDriveLesson = (
  courseId: string,
  payload: {
    title: string;
    type: "video" | "audio";
    fileUrl: string;
    order: number;
    duration?: number;
  },
): Promise<ApiResponse<Lesson>> =>
  content.addDriveLesson("live-courses", courseId, payload);

export const updateLiveCourseLesson = (
  courseId: string,
  id: string,
  payload: Partial<Pick<Lesson, "title" | "order" | "duration">>,
): Promise<ApiResponse<Lesson>> =>
  content.updateLesson("live-courses", courseId, id, payload);

export const deleteLiveCourseLesson = (
  courseId: string,
  id: string,
): Promise<ApiResponse<null>> => content.deleteLesson("live-courses", courseId, id);
