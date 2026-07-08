"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  createCase,
  updateCase,
  updateCaseImage,
  updateCaseStationImage,
} from "@/services/cases.service";
import type { ApiFailure, CaseInput, FormActionResult } from "@/types/api";

type SaveResult = FormActionResult & { caseId?: string };

export async function saveCaseAction(input: {
  id?: string;
  payload: CaseInput;
}): Promise<SaveResult> {
  try {
    const res = input.id
      ? await updateCase(input.id, input.payload)
      : await createCase(input.payload);

    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }
    revalidatePath("/admin-casebank");
    return {
      ok: true,
      message: input.id ? "Case updated" : "Case created",
      caseId: res.data._id,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error("[saveCaseAction] axios error:", err.code, err.message);
      return {
        ok: false,
        message: "Network error — please try again.",
      };
    }
    console.error("[saveCaseAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}

/** Upload cover (`image`) and/or station (`stationImage`) files for an existing case. */
export async function uploadCaseImagesAction(
  id: string,
  formData: FormData,
): Promise<FormActionResult> {
  try {
    const cover = formData.get("image");
    if (cover instanceof File && cover.size > 0) {
      const r = await updateCaseImage(id, cover);
      if (!r.success) return { ok: false, message: r.message };
    }
    const station = formData.get("stationImage");
    if (station instanceof File && station.size > 0) {
      const r = await updateCaseStationImage(id, station);
      if (!r.success) return { ok: false, message: r.message };
    }
    return { ok: true };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[uploadCaseImagesAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Image upload failed." };
    }
    console.error("[uploadCaseImagesAction] unexpected error:", err);
    return { ok: false, message: "Image upload failed." };
  }
}
