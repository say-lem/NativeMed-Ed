"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { deleteCourse, publishCourse } from "@/services/courses.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/** Toggle a course between published and draft (PATCH /courses/:id/publish). */
export async function togglePublishCourseAction(
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await publishCourse(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-courses");
    return {
      ok: true,
      message: res.data.isPublished ? "Course published" : "Course unpublished",
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[togglePublishCourseAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't update publish state." };
    }
    console.error("[togglePublishCourseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** Permanently delete a course (DELETE /courses/:id). */
export async function deleteCourseAction(
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await deleteCourse(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-courses");
    return { ok: true, message: "Course deleted" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[deleteCourseAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't delete the course." };
    }
    console.error("[deleteCourseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
