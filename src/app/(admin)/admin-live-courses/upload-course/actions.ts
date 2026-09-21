"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  createLiveCourse,
  publishLiveCourse,
  updateLiveCourse,
  updateLiveCourseThumbnail,
  updateLiveCourseTocPdf,
} from "@/services/liveCourses.service";
import type { ApiFailure, FormActionResult, LiveCourseInput } from "@/types/api";

type SaveResult = FormActionResult & { courseId?: string };

export async function saveLiveCourseAction(input: {
  id?: string;
  payload: LiveCourseInput;
  publish: boolean;
}): Promise<SaveResult> {
  try {
    const res = input.id
      ? await updateLiveCourse(input.id, input.payload)
      : await createLiveCourse({ ...input.payload, isPublished: input.publish });

    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }

    const course = res.data;
    if (!!course.isPublished !== input.publish) {
      try {
        await publishLiveCourse(course._id);
      } catch {
        // Non-fatal — the course saved; only the publish flip failed.
      }
    }

    revalidatePath("/admin-live-courses");
    return {
      ok: true,
      message: input.id
        ? input.publish
          ? "Live course updated & published"
          : "Live course saved as draft"
        : input.publish
          ? "Live course created & published"
          : "Live course saved as draft",
      courseId: course._id,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error("[saveLiveCourseAction] axios error:", err.code, err.message);
      return { ok: false, message: "Network error — please try again." };
    }
    console.error("[saveLiveCourseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function uploadLiveCourseThumbnailAction(
  id: string,
  formData: FormData,
): Promise<FormActionResult> {
  try {
    const file = formData.get("thumbnail");
    if (!(file instanceof File) || file.size === 0) return { ok: true };
    const res = await updateLiveCourseThumbnail(id, file);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-live-courses");
    return { ok: true };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[uploadLiveCourseThumbnailAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Cover upload failed." };
    }
    console.error("[uploadLiveCourseThumbnailAction] unexpected error:", err);
    return { ok: false, message: "Cover upload failed." };
  }
}

export async function uploadLiveCourseTocPdfAction(
  id: string,
  formData: FormData,
): Promise<FormActionResult> {
  try {
    const file = formData.get("tocPdf");
    if (!(file instanceof File) || file.size === 0) return { ok: true };
    const res = await updateLiveCourseTocPdf(id, file);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-live-courses");
    return { ok: true };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[uploadLiveCourseTocPdfAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Course schedule upload failed." };
    }
    console.error("[uploadLiveCourseTocPdfAction] unexpected error:", err);
    return { ok: false, message: "Course schedule upload failed." };
  }
}
