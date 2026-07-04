"use server";

import axios from "axios";
import { createCase, updateCase } from "@/services/cases.service";
import type { ApiFailure, CaseInput, FormActionResult } from "@/types/api";

export async function saveCaseAction(input: {
  id?: string;
  payload: CaseInput;
}): Promise<FormActionResult> {
  try {
    const res = input.id
      ? await updateCase(input.id, input.payload)
      : await createCase(input.payload);

    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }
    return { ok: true, message: input.id ? "Case updated" : "Case created" };
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
