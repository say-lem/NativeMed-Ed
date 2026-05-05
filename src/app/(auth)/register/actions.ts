"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { setSession } from "@/lib/session";
import { registerSchema, type RegisterValues } from "@/lib/schemas/auth";
import { register } from "@/services/auth.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

export async function registerAction(
  values: RegisterValues,
): Promise<FormActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await register(parsed.data);
    if (!response.success) {
      return {
        ok: false,
        message: response.message,
        fieldErrors: response.errors,
      };
    }
    await setSession({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error("[registerAction] axios error:", err.code, err.message, err.config?.url);
    } else {
      console.error("[registerAction] unexpected error:", err);
    }
    return { ok: false, message: "Network error. Please try again." };
  }

  redirect("/dashboard");
}
