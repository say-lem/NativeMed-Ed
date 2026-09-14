"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  deleteCase,
  duplicateCase,
  updateCaseBankOverview,
  updateCaseBankOverviewImage,
} from "@/services/cases.service";
import {
  caseBankOverviewSchema,
  caseBankOverviewPayload,
  type CaseBankOverviewValues,
} from "@/lib/schemas/caseBankOverview";
import type { ApiFailure, FormActionResult } from "@/types/api";

function revalidateCaseBank() {
  revalidatePath("/admin-casebank");
  revalidatePath("/free-cases");
  revalidatePath("/products");
  revalidatePath("/products/case-bank");
}

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

/** PATCH /cases/admin/overview — title/description of the case bank as a product. */
export async function updateCaseBankOverviewAction(
  values: CaseBankOverviewValues,
): Promise<FormActionResult> {
  const parsed = caseBankOverviewSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateCaseBankOverview(caseBankOverviewPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateCaseBank();
    return { ok: true, message: "Case bank overview updated" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[updateCaseBankOverviewAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't update the overview." };
    }
    console.error("[updateCaseBankOverviewAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** PATCH /cases/admin/overview/image — cover image shown on the products page card. */
export async function updateCaseBankOverviewImageAction(
  formData: FormData,
): Promise<FormActionResult> {
  try {
    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Please choose an image." };
    }
    const res = await updateCaseBankOverviewImage(file);
    if (!res.success) return { ok: false, message: res.message };
    revalidateCaseBank();
    return { ok: true, message: "Cover image updated" };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[updateCaseBankOverviewImageAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't update the cover image." };
    }
    console.error("[updateCaseBankOverviewImageAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
