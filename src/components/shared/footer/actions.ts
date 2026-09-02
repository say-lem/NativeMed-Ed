"use server";

import axios from "axios";
import { reviewSchema, type ReviewValues } from "@/lib/schemas/review";
import { submitReview } from "@/services/reviews.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/** Submit a homepage review. Public, no auth — lands as "pending" until an admin approves it. */
export async function submitReviewAction(
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
    const res = await submitReview(parsed.data);
    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }
    return {
      ok: true,
      message: res.message ?? "Thanks — your review is awaiting approval.",
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error(
        "[submitReviewAction] axios error:",
        err.response?.status ?? err.code,
        err.message,
      );
      return {
        ok: false,
        message: "Couldn't reach the server. Please try again.",
      };
    }
    console.error("[submitReviewAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
