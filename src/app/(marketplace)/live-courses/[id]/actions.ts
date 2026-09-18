"use server";
import axios from "axios";
import { getOrigin } from "@/lib/checkout";
import { purchaseLiveCourse } from "@/services/liveCourses.service";

export interface LiveCourseCheckoutResult {
  ok: boolean;
  url?: string;
  message?: string;
  /** 409 — already purchased/enrolled. */
  alreadyPurchased?: boolean;
}

/** Kick off a one-time Stripe Checkout for a live course and return the redirect URL.
 *  Uses `POST /live-courses/:id/purchase` — NOT the subscription `/payments/checkout`
 *  flow, since a live course is a single payment, not recurring billing. */
export async function startLiveCourseCheckout(
  courseId: string,
): Promise<LiveCourseCheckoutResult> {
  try {
    const origin = await getOrigin();
    const ctx = new URLSearchParams({ type: "live_course", courseId });
    const successUrl =
      `${origin}/payment/success?${ctx.toString()}` + `&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/payment/cancel`;

    const res = await purchaseLiveCourse(courseId, { successUrl, cancelUrl });
    if (!res.success) {
      return { ok: false, message: res.message ?? "Checkout failed." };
    }
    if (!res.data.url) {
      console.error("[startLiveCourseCheckout] no url in response:", JSON.stringify(res));
      return { ok: false, message: "Checkout couldn't be started. Please try again." };
    }
    return { ok: true, url: res.data.url };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as { message?: string } | undefined;
      console.error(
        "[startLiveCourseCheckout] backend error:",
        status,
        JSON.stringify(err.response?.data),
      );
      if (status === 409) {
        return {
          ok: false,
          alreadyPurchased: true,
          message: data?.message ?? "You already have access to this live course.",
        };
      }
      if (status === 404) {
        return { ok: false, message: "This live course is no longer available." };
      }
      return {
        ok: false,
        message:
          data?.message ??
          (status ? `Checkout failed (${status}).` : "Couldn't reach the server. Please try again."),
      };
    }
    console.error("[startLiveCourseCheckout] action error:", err);
    return { ok: false, message: "Something went wrong starting checkout." };
  }
}
