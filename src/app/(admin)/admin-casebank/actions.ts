"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { deleteCase, duplicateCase } from "@/services/cases.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/** Permanently delete a case (DELETE /cases/:id). */
export async function deleteCaseAction(
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await deleteCase(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-casebank");
    return { ok: true, message: "Case deleted" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[deleteCaseAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't delete the case." };
    }
    console.error("[deleteCaseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** Duplicate a case as a draft copy (POST /cases/:id/duplicate). */
export async function duplicateCaseAction(
  id: string,
): Promise<FormActionResult> {
  try {
    const res = await duplicateCase(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-casebank");
    return { ok: true, message: "Case duplicated as a draft" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[duplicateCaseAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't duplicate the case." };
    }
    console.error("[duplicateCaseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
