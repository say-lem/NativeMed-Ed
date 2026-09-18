"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  deleteLiveCourse,
  endLiveCourse,
  pauseLiveCoursePayments,
  publishLiveCourse,
  resumeLiveCoursePayments,
} from "@/services/liveCourses.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/** Toggle a live course between published and draft. */
export async function togglePublishLiveCourseAction(
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await publishLiveCourse(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-live-courses");
    return {
      ok: true,
      message: res.data.isPublished ? "Live course published" : "Live course unpublished",
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[togglePublishLiveCourseAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't update publish state." };
    }
    console.error("[togglePublishLiveCourseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** Toggle new purchases for a live course without touching visibility. */
export async function toggleLiveCoursePaymentsPausedAction(
  id: string,
  paused: boolean,
): Promise<FormActionResult> {
  try {
    const res = paused
      ? await pauseLiveCoursePayments(id)
      : await resumeLiveCoursePayments(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-live-courses");
    return {
      ok: true,
      message: res.data.paymentsPaused ? "Payments paused" : "Payments resumed",
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[toggleLiveCoursePaymentsPausedAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't update payment state." };
    }
    console.error("[toggleLiveCoursePaymentsPausedAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** End a live course — revokes every active enrollment's Drive access. The course stays
 *  listed (still purchasable unless also unpublished/paused). */
export async function endLiveCourseAction(id: string): Promise<FormActionResult> {
  try {
    const res = await endLiveCourse(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-live-courses");
    return { ok: true, message: "Live course ended — all enrollments revoked" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[endLiveCourseAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't end the course." };
    }
    console.error("[endLiveCourseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** Permanently delete a live course. */
export async function deleteLiveCourseAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteLiveCourse(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-live-courses");
    return { ok: true, message: "Live course deleted" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[deleteLiveCourseAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't delete the live course." };
    }
    console.error("[deleteLiveCourseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
