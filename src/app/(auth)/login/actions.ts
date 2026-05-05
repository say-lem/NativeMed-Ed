"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { setSession } from "@/lib/session";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth";
import { login } from "@/services/auth.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

export async function loginAction(values: LoginValues): Promise<FormActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await login(parsed.data);
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
      console.error("[loginAction] axios error:", err.code, err.message, err.config?.url);
    } else {
      console.error("[loginAction] unexpected error:", err);
    }
    return { ok: false, message: "Network error. Please try again." };
  }

  redirect("/dashboard");
}
