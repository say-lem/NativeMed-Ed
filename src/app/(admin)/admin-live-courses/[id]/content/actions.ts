"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  addLiveCourseDriveLesson,
  deleteLiveCourseLesson,
  updateLiveCourseLesson,
  uploadLiveCoursePdfLesson,
} from "@/services/liveCourses.service";
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

    const res = await uploadLiveCoursePdfLesson(courseId, { file, title, order });
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath(`/admin-live-courses/${courseId}/content`);
    return { ok: true, message: "PDF lesson added" };
  } catch (err) {
    return fail(err, "addPdfLessonAction", "Couldn't add the PDF lesson.");
  }
}

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
    const res = await addLiveCourseDriveLesson(courseId, payload);
    if (!res.success)
      return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath(`/admin-live-courses/${courseId}/content`);
    return { ok: true, message: `${payload.type === "audio" ? "Audio" : "Video"} lesson added` };
  } catch (err) {
    return fail(err, "addDriveLessonAction", "Couldn't add the lesson.");
  }
}

export async function updateLessonAction(
  courseId: string,
  id: string,
  payload: { title?: string; order?: number; duration?: number },
): Promise<FormActionResult> {
  try {
    const res = await updateLiveCourseLesson(courseId, id, payload);
    if (!res.success)
      return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath(`/admin-live-courses/${courseId}/content`);
    return { ok: true, message: "Lesson updated" };
  } catch (err) {
    return fail(err, "updateLessonAction", "Couldn't update the lesson.");
  }
}

export async function deleteLessonAction(
  courseId: string,
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await deleteLiveCourseLesson(courseId, id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath(`/admin-live-courses/${courseId}/content`);
    return { ok: true, message: "Lesson deleted" };
  } catch (err) {
    return fail(err, "deleteLessonAction", "Couldn't delete the lesson.");
  }
}
