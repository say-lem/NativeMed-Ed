"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  changePassword,
  logoutAll,
  updateProfile,
} from "@/services/auth.service";
import { clearSession } from "@/lib/session";
import type { ApiFailure, FormActionResult } from "@/types/api";
import type { PasswordValues, ProfileValues } from "@/lib/schemas/settings";

type ProfilePayload = ProfileValues;

export async function updateProfileAction(
  payload: ProfilePayload,
): Promise<FormActionResult> {
  try {
    const res = await updateProfile(payload);
    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }
    revalidatePath("/admin-settings");
    return { ok: true, message: "Profile updated" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message)
        return { ok: false, message: data.message, fieldErrors: data.errors };
      console.error("[updateProfileAction] axios error:", err.code, err.message);
      return { ok: false, message: "Network error — please try again." };
    }
    console.error("[updateProfileAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function changePasswordAction(
  payload: PasswordValues,
): Promise<FormActionResult> {
  try {
    const res = await changePassword(payload);
    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }
    return { ok: true, message: "Password changed" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message)
        return { ok: false, message: data.message, fieldErrors: data.errors };
      console.error("[changePasswordAction] axios error:", err.code, err.message);
      return { ok: false, message: "Network error — please try again." };
    }
    console.error("[changePasswordAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** Log out of every device, clear this session, and redirect to login. */
export async function logoutAllAction(): Promise<void> {
  try {
    await logoutAll();
  } catch {
    // Non-fatal — clear locally regardless.
  }
  await clearSession();
  redirect("/login");
}
