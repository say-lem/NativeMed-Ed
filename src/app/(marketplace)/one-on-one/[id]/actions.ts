"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { bookSession } from "@/services/booking.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/** Reserve a date on a one-on-one session product. No payment gate — informational price only. */
export async function bookSessionAction(
  productId: string,
  values: { date: string; time: string },
): Promise<FormActionResult> {
  if (!values.date) return { ok: false, message: "Choose a date first." };
  if (!values.time) return { ok: false, message: "Choose a time first." };

  try {
    const res = await bookSession(productId, values);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath(`/one-on-one/${productId}`);
    revalidatePath("/one-on-one");
    return { ok: true, message: "Session booked — we'll be in touch to confirm." };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[bookSessionAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't book that session." };
    }
    console.error("[bookSessionAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
