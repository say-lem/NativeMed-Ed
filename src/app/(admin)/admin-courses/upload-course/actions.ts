"use server";

import axios from "axios";
import {
  createCourse,
  publishCourse,
  updateCourse,
  updateCourseThumbnail,
} from "@/services/courses.service";
import type { ApiFailure, CourseInput, FormActionResult } from "@/types/api";

type SaveResult = FormActionResult & { courseId?: string };

export async function saveCourseAction(input: {
  id?: string;
  payload: CourseInput;
  publish: boolean;
}): Promise<SaveResult> {
  try {
    const res = input.id
      ? await updateCourse(input.id, input.payload)
      : await createCourse(input.payload);

    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }

    const course = res.data;
    // POST /courses can't set isPublished (unknown fields are stripped), so
    // reconcile the published state via the publish toggle if it differs.
    if (!!course.isPublished !== input.publish) {
      try {
        await publishCourse(course._id);
      } catch {
        // Non-fatal — the course saved; only the publish flip failed.
      }
    }

    return {
      ok: true,
      message: input.id
        ? input.publish
          ? "Course updated & published"
          : "Course saved as draft"
        : input.publish
          ? "Course created & published"
          : "Course saved as draft",
      courseId: course._id,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error("[saveCourseAction] axios error:", err.code, err.message);
      return { ok: false, message: "Network error — please try again." };
    }
    console.error("[saveCourseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function uploadCourseThumbnailAction(
  id: string,
  formData: FormData,
): Promise<FormActionResult> {
  try {
    const file = formData.get("thumbnail");
    if (!(file instanceof File) || file.size === 0) return { ok: true };
    const res = await updateCourseThumbnail(id, file);
    return res.success
      ? { ok: true }
      : { ok: false, message: res.message };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[uploadCourseThumbnailAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Cover upload failed." };
    }
    console.error("[uploadCourseThumbnailAction] unexpected error:", err);
    return { ok: false, message: "Cover upload failed." };
  }
}
