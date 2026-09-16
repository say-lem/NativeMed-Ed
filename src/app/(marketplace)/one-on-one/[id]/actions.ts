"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { getOrigin } from "@/lib/checkout";
import { bookSession, requestSlotAvailability } from "@/services/booking.service";
import {
  slotAvailabilityRequestSchema,
  slotAvailabilityRequestPayload,
  type SlotAvailabilityRequestValues,
} from "@/lib/schemas/booking";
import type { ApiFailure, FormActionResult } from "@/types/api";

export interface BookSessionActionResult {
  ok: boolean;
  url?: string;
  message?: string;
}

/**
 * Reserves the (date, time) slot and starts Stripe Checkout for the session's price. The
 * booking is `pending` — NOT confirmed — until Stripe's webhook fires; the caller must
 * redirect the browser to the returned `url` to complete payment.
 *
 * `session_id={CHECKOUT_SESSION_ID}` is a literal Stripe placeholder — kept unescaped
 * (not built via URLSearchParams) so Stripe can substitute it on redirect, same convention
 * as `lib/checkout.ts`'s `runCheckout`.
 */
export async function bookSessionAction(
  productId: string,
  values: { date: string; time: string },
): Promise<BookSessionActionResult> {
  if (!values.date) return { ok: false, message: "Choose a date first." };
  if (!values.time) return { ok: false, message: "Choose a time first." };

  try {
    const origin = await getOrigin();
    const successUrl = `${origin}/payment/success?type=booking&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/payment/cancel?from=booking`;

    const res = await bookSession(productId, { ...values, successUrl, cancelUrl });
    if (!res.success) return { ok: false, message: res.message };

    if (!res.data.url) {
      console.error("[bookSessionAction] no url in response:", JSON.stringify(res));
      return { ok: false, message: "Checkout couldn't be started. Please try again." };
    }

    revalidatePath(`/one-on-one/${productId}`);
    revalidatePath("/one-on-one");
    return { ok: true, url: res.data.url };
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

/**
 * Lets a user reach out about a session with no open slot right now. The backend only
 * accepts this when the product genuinely has nothing bookable — 400s otherwise.
 */
export async function requestSlotAvailabilityAction(
  productId: string,
  values: SlotAvailabilityRequestValues,
): Promise<FormActionResult> {
  const parsed = slotAvailabilityRequestSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await requestSlotAvailability(productId, slotAvailabilityRequestPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    return { ok: true, message: res.message };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiFailure | undefined;
      console.error("[requestSlotAvailabilityAction] axios error:", err.code, err.message);
      return { ok: false, message: data?.message ?? "Couldn't send your request." };
    }
    console.error("[requestSlotAvailabilityAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
