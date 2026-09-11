"use server";

import axios from "axios";
import { feedbackSchema, type FeedbackValues } from "@/lib/schemas/feedback";
import { submitFeedback } from "@/services/feedback.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/** Submit site feedback. Public, no auth — lands straight in the admin inbox. */
export async function submitFeedbackAction(
  values: FeedbackValues,
): Promise<FormActionResult> {
  const parsed = feedbackSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await submitFeedback({
      name: parsed.data.name || undefined,
      message: parsed.data.message,
    });
    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }
    return {
      ok: true,
      message: res.message ?? "Thank you for your feedback",
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error(
        "[submitFeedbackAction] axios error:",
        err.response?.status ?? err.code,
        err.message,
      );
      return {
        ok: false,
        message: "Couldn't reach the server. Please try again.",
      };
    }
    console.error("[submitFeedbackAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
