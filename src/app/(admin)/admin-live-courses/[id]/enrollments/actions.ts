"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  manualEnrollLiveCourse,
  restoreLiveCourseEnrollment,
  revokeLiveCourseEnrollment,
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

export async function manualEnrollLiveCourseAction(
  courseId: string,
  userId: string,
): Promise<FormActionResult> {
  if (!userId) return { ok: false, message: "Pick a user." };
  try {
    const res = await manualEnrollLiveCourse(courseId, userId);
    if (!res.success)
      return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath(`/admin-live-courses/${courseId}/enrollments`);
    return { ok: true, message: "Access granted" };
  } catch (err) {
    return fail(err, "manualEnrollLiveCourseAction", "Couldn't grant access.");
  }
}

export async function revokeLiveCourseEnrollAction(
  courseId: string,
  userId: string,
): Promise<FormActionResult> {
  try {
    const res = await revokeLiveCourseEnrollment(courseId, userId);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath(`/admin-live-courses/${courseId}/enrollments`);
    return { ok: true, message: "Access revoked" };
  } catch (err) {
    return fail(err, "revokeLiveCourseEnrollAction", "Couldn't revoke access.");
  }
}

export async function restoreLiveCourseEnrollAction(
  courseId: string,
  enrollmentId: string,
): Promise<FormActionResult> {
  try {
    const res = await restoreLiveCourseEnrollment(enrollmentId);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath(`/admin-live-courses/${courseId}/enrollments`);
    return { ok: true, message: "Access restored" };
  } catch (err) {
    return fail(err, "restoreLiveCourseEnrollAction", "Couldn't restore access.");
  }
}
