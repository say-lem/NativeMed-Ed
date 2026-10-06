import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, Lesson } from "@/types/api";

/**
 * Generic course-content client — the backend mounts the SAME content module under both
 * `/courses/:courseId/content` and `/live-courses/:courseId/content` (one CourseContent
 * collection, discriminated server-side by a `courseType` field), so this is parameterized
 * by that base path instead of duplicating the whole module per course type.
 *
 * No tier gating on reads — any enrolled user (or the course's creator/admin) can read
 * every lesson. `updateContent` is metadata-only (title/order/duration) — never re-uploads
 * the file; delete + re-add to replace one.
 */
export type ContentBasePath = "courses" | "live-courses";

/** GET /:basePath/:courseId/content — auth. All lessons for a course, sorted by `order`.
 *  PDF `fileUrl`s are freshly-signed on every call — never cache the response. */
export async function getCourseContent(
  basePath: ContentBasePath,
  courseId: string,
): Promise<ApiResponse<Lesson[]>> {
  const res = await api.get<ApiResponse<Lesson[]>>(
    `/${basePath}/${courseId}/content`,
  );
  return res.data;
}

/** POST /:basePath/:courseId/content/pdf-link — admin, JSON. Registers a PDF lesson
 *  already uploaded directly to Cloudinary by the browser (see uploads.service.ts) —
 *  the file bytes never pass through our server. */
export async function registerPdfLesson(
  basePath: ContentBasePath,
  courseId: string,
  payload: { title: string; order: number; fileUrl: string; publicId: string },
): Promise<ApiResponse<Lesson>> {
  const res = await api.post<ApiResponse<Lesson>>(`/${basePath}/${courseId}/content/pdf-link`, {
    ...payload,
    type: "pdf",
  });
  return res.data;
}

/** POST /:basePath/:courseId/content/drive-link — admin, JSON. A video or audio lesson
 *  (Google-Drive share link the admin adds manually — never uploaded through us). */
export async function addDriveLesson(
  basePath: ContentBasePath,
  courseId: string,
  payload: {
    title: string;
    type: "video" | "audio";
    fileUrl: string;
    order: number;
    duration?: number; // seconds
  },
): Promise<ApiResponse<Lesson>> {
  const res = await api.post<ApiResponse<Lesson>>(
    `/${basePath}/${courseId}/content/drive-link`,
    payload,
  );
  return res.data;
}

/** PATCH /:basePath/:courseId/content/:id — admin. Metadata only. */
export async function updateLesson(
  basePath: ContentBasePath,
  courseId: string,
  id: string,
  payload: Partial<Pick<Lesson, "title" | "order" | "duration">>,
): Promise<ApiResponse<Lesson>> {
  const res = await api.patch<ApiResponse<Lesson>>(
    `/${basePath}/${courseId}/content/${id}`,
    payload,
  );
  return res.data;
}

/** DELETE /:basePath/:courseId/content/:id — admin. PDFs also remove the Cloudinary asset;
 *  video/audio only remove the DB record (the Drive file itself isn't touched). */
export async function deleteLesson(
  basePath: ContentBasePath,
  courseId: string,
  id: string,
): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(
    `/${basePath}/${courseId}/content/${id}`,
  );
  return res.data;
}
