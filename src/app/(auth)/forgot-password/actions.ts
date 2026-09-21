"use server";

import axios from "axios";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/schemas/auth";
import { forgotPassword } from "@/services/auth.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

export async function forgotPasswordAction(
  values: ForgotPasswordValues,
): Promise<FormActionResult> {
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await forgotPassword(parsed.data);
    if (!response.success) {
      return {
        ok: false,
        message: response.message,
        fieldErrors: response.errors,
      };
    }
    return { ok: true, message: response.message };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error(
        "[forgotPasswordAction] axios error:",
        err.code,
        err.message,
        err.config?.url,
      );
    } else {
      console.error("[forgotPasswordAction] unexpected error:", err);
    }
    return { ok: false, message: "Network error. Please try again." };
  }
}
