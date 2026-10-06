"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { deleteFeedback } from "@/services/feedback.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/** Permanently delete a feedback message from the private admin inbox. */
export async function deleteFeedbackAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteFeedback(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-dashboard");
    return { ok: true, message: "Feedback deleted" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[deleteFeedbackAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't delete the feedback." };
    }
    console.error("[deleteFeedbackAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
