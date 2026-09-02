"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  approveReview,
  revokeReview,
  deleteReview,
  updateReview,
} from "@/services/reviews.service";
import { reviewSchema, type ReviewValues } from "@/lib/schemas/review";
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

/** Approve a pending (or previously revoked) review so it appears on the homepage. */
export async function approveReviewAction(id: string): Promise<FormActionResult> {
  try {
    const res = await approveReview(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-reviews");
    revalidatePath("/");
    return { ok: true, message: "Review approved" };
  } catch (err) {
    return fail(err, "approveReviewAction", "Couldn't approve the review.");
  }
}

/** Pull a previously approved review from the homepage. */
export async function revokeReviewAction(id: string): Promise<FormActionResult> {
  try {
    const res = await revokeReview(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-reviews");
    revalidatePath("/");
    return { ok: true, message: "Review revoked" };
  } catch (err) {
    return fail(err, "revokeReviewAction", "Couldn't revoke the review.");
  }
}

/** Permanently delete a review. */
export async function deleteReviewAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteReview(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-reviews");
    revalidatePath("/");
    return { ok: true, message: "Review deleted" };
  } catch (err) {
    return fail(err, "deleteReviewAction", "Couldn't delete the review.");
  }
}

/** Edit a review's content. Backend only allows this while it's still "pending". */
export async function updateReviewAction(
  id: string,
  values: ReviewValues,
): Promise<FormActionResult> {
  const parsed = reviewSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateReview(id, parsed.data);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-reviews");
    revalidatePath("/");
    return { ok: true, message: "Review updated" };
  } catch (err) {
    return fail(err, "updateReviewAction", "Couldn't update the review.");
  }
}
