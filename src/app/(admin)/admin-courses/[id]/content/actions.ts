"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  addDriveLesson,
  deleteLesson,
  updateLesson,
  uploadPdfLesson,
} from "@/services/courses.service";
import type { ApiFailure, FormActionResult, Lesson } from "@/types/api";

function fail(err: unknown, tag: string, fallback: string): FormActionResult {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiFailure | undefined;
    console.error(`[${tag}] axios error:`, err.code, err.message);
    return { ok: false, message: data?.message ?? fallback, fieldErrors: data?.errors };
  }
  console.error(`[${tag}] unexpected error:`, err);
  return { ok: false, message: "Something went wrong." };
}

/** Add a PDF lesson (multipart) — reads `file`, `title`, `order` from formData. */
export async function addPdfLessonAction(
  courseId: string,
  formData: FormData,
): Promise<FormActionResult> {
  try {
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const order = Number(formData.get("order") ?? 0);
    if (!(file instanceof File) || file.size === 0)
      return { ok: false, message: "Please choose a PDF file." };
    if (!title) return { ok: false, message: "Title is required." };

    const res = await uploadPdfLesson(courseId, { file, title, order });
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath(`/admin-courses/${courseId}/content`);
    return { ok: true, message: "PDF lesson added" };
  } catch (err) {
    return fail(err, "addPdfLessonAction", "Couldn't add the PDF lesson.");
  }
}

/** Add a video or audio lesson (Google-Drive link, JSON). */
export async function addDriveLessonAction(
  courseId: string,
  payload: {
    title: string;
    type: "video" | "audio";
    fileUrl: string;
    order: number;
    duration?: number;
  },
): Promise<FormActionResult> {
  try {
    const res = await addDriveLesson(courseId, payload);
    if (!res.success)
      return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath(`/admin-courses/${courseId}/content`);
    return { ok: true, message: `${payload.type === "audio" ? "Audio" : "Video"} lesson added` };
  } catch (err) {
    return fail(err, "addDriveLessonAction", "Couldn't add the lesson.");
  }
}

/** Update a lesson's title / order / duration. */
export async function updateLessonAction(
  courseId: string,
  id: string,
  payload: Partial<Pick<Lesson, "title" | "order" | "duration">>,
): Promise<FormActionResult> {
  try {
    const res = await updateLesson(courseId, id, payload);
    if (!res.success)
      return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath(`/admin-courses/${courseId}/content`);
    return { ok: true, message: "Lesson updated" };
  } catch (err) {
    return fail(err, "updateLessonAction", "Couldn't update the lesson.");
  }
}

/** Persist a new lesson order — PATCHes each changed lesson's `order`. */
export async function reorderLessonsAction(
  courseId: string,
  ordered: { id: string; order: number }[],
): Promise<FormActionResult> {
  try {
    await Promise.all(
      ordered.map((o) => updateLesson(courseId, o.id, { order: o.order })),
    );
    revalidatePath(`/admin-courses/${courseId}/content`);
    return { ok: true, message: "Order saved" };
  } catch (err) {
    return fail(err, "reorderLessonsAction", "Couldn't save the new order.");
  }
}

/** Delete a lesson. */
export async function deleteLessonAction(
  courseId: string,
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await deleteLesson(courseId, id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath(`/admin-courses/${courseId}/content`);
    return { ok: true, message: "Lesson deleted" };
  } catch (err) {
    return fail(err, "deleteLessonAction", "Couldn't delete the lesson.");
  }
}
