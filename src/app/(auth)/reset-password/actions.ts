"use server";

import axios from "axios";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/schemas/auth";
import { resetPassword } from "@/services/auth.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

export async function resetPasswordAction(
  values: ResetPasswordValues,
): Promise<FormActionResult> {
  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await resetPassword(parsed.data);
    if (!response.success) {
      // Invalid/expired token comes back as a plain message, no `errors` field.
      return { ok: false, message: response.message, fieldErrors: response.errors };
    }
    return { ok: true, message: response.message };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error(
        "[resetPasswordAction] axios error:",
        err.code,
        err.message,
        err.config?.url,
      );
    } else {
      console.error("[resetPasswordAction] unexpected error:", err);
    }
    return { ok: false, message: "Network error. Please try again." };
  }
}
