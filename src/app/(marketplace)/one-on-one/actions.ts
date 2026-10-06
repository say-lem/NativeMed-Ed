"use server";

import axios from "axios";
import { resumeBookingPayment } from "@/services/booking.service";
import type { ApiFailure } from "@/types/api";

export interface ResumeBookingPaymentActionResult {
  ok: boolean;
  url?: string;
  message?: string;
}

/**
 * Resumes a still-pending booking's existing Stripe Checkout session — used by the
 * countdown on "My Bookings" so a user who navigated away mid-payment can pick up where
 * they left off without losing their held slot. The caller must redirect the browser to
 * the returned `url`. 410 once the hour-long payment window has passed.
 */
export async function resumeBookingPaymentAction(
  bookingId: string,
): Promise<ResumeBookingPaymentActionResult> {
  try {
    const res = await resumeBookingPayment(bookingId);
    if (!res.success) return { ok: false, message: res.message };

    if (!res.data.url) {
      console.error("[resumeBookingPaymentAction] no url in response:", JSON.stringify(res));
      return { ok: false, message: "Checkout couldn't be resumed. Please try again." };
    }

    return { ok: true, url: res.data.url };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[resumeBookingPaymentAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't resume payment." };
    }
    console.error("[resumeBookingPaymentAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
