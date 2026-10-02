"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  addDriveLesson,
  deleteLesson,
  registerPdfLesson,
  updateLesson,
} from "@/services/courses.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

function fail(err: unknown, tag: string, fallback: string): FormActionResult {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiFailure | undefined;
    console.error(`[${tag}] axios error:`, err.code, err.message);
    return { ok: false, message: data?.message ?? fallback, fieldErrors: data?.errors };
  }
  console.error(`[${tag}] unexpected error:`, err);
  return { ok: false, message: "Something went wrong." };
}

/** Register a PDF lesson already uploaded directly to Cloudinary by the browser. */
export async function addPdfLessonAction(
  courseId: string,
  payload: { title: string; order: number; fileUrl: string; publicId: string },
): Promise<FormActionResult> {
  try {
    if (!payload.title.trim()) return { ok: false, message: "Title is required." };

    const res = await registerPdfLesson(courseId, payload);
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

/** Update a lesson's title / order / duration. Also used (per-item) to persist reordering. */
export async function updateLessonAction(
  courseId: string,
  id: string,
  payload: { title?: string; order?: number; duration?: number },
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
