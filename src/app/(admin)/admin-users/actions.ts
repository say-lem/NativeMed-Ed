"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { createAdmin, toggleUserStatus } from "@/services/admin.service";
import type { ApiFailure, CreateAdminInput, FormActionResult } from "@/types/api";

/** Activate or deactivate a user (PATCH /auth/admin/users/:userId/toggle-status). */
export async function toggleUserStatusAction(
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await toggleUserStatus(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-users");
    return { ok: true, message: "User status updated" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[toggleUserStatusAction] axios error:", err.code, err.message);
      return {
        ok: false,
        message: data?.message ?? "Couldn't update the user's status.",
      };
    }
    console.error("[toggleUserStatusAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** Create a new admin account (POST /auth/admin/users). */
export async function createAdminAction(
  input: CreateAdminInput,
): Promise<FormActionResult> {
  try {
    const res = await createAdmin(input);
    if (!res.success)
      return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-users");
    return { ok: true, message: res.message ?? "Admin account created" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[createAdminAction] axios error:", err.code, err.message);
      return {
        ok: false,
        message: data?.message ?? "Couldn't create the admin account.",
        fieldErrors: data?.errors,
      };
    }
    console.error("[createAdminAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
