"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  manualEnroll,
  restoreEnroll,
  revokeEnroll,
} from "@/services/enrollments.service";
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

/** Grant a user access to a course. */
export async function manualEnrollAction(
  userId: string,
  courseId: string,
): Promise<FormActionResult> {
  if (!userId || !courseId)
    return { ok: false, message: "Pick both a user and a course." };
  try {
    const res = await manualEnroll(userId, courseId);
    if (!res.success)
      return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-enrollments");
    return { ok: true, message: "Access granted" };
  } catch (err) {
    return fail(err, "manualEnrollAction", "Couldn't grant access.");
  }
}

/** Revoke a user's access to a course. */
export async function revokeEnrollAction(
  userId: string,
  courseId: string,
): Promise<FormActionResult> {
  try {
    const res = await revokeEnroll(userId, courseId);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-enrollments");
    return { ok: true, message: "Access revoked" };
  } catch (err) {
    return fail(err, "revokeEnrollAction", "Couldn't revoke access.");
  }
}

/** Restore a revoked enrollment. */
export async function restoreEnrollAction(
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await restoreEnroll(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-enrollments");
    return { ok: true, message: "Access restored" };
  } catch (err) {
    return fail(err, "restoreEnrollAction", "Couldn't restore access.");
  }
}
