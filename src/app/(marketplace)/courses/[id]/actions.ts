"use server";
import axios from "axios";
import { headers } from "next/headers";
import {
  createCheckout,
  type CourseTier,
  type PaymentInterval,
} from "@/services/payments.service";

export interface CheckoutActionResult {
  ok: boolean;
  url?: string;
  message?: string;
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/** Kick off Stripe checkout for a course subscription and return the redirect URL. */
export async function startCourseCheckout(
  courseId: string,
  tier: CourseTier,
  interval: PaymentInterval,
): Promise<CheckoutActionResult> {
  try {
    const origin = await getOrigin();
    const res = await createCheckout({
      type: "course",
      tier,
      interval,
      courseId,
      successUrl: `${origin}/payment/success`,
      cancelUrl: `${origin}/payment/cancel`,
    });

    // TEMP probe — learn the checkout response shape (Stripe URL field), then tighten.
    console.log(
      "[payments/checkout] raw response:",
      JSON.stringify(res, null, 2),
    );

    if (!res.success) {
      return { ok: false, message: res.message ?? "Checkout failed." };
    }

    // Response shape unverified — try the common Stripe URL field names.
    const data = res.data as Record<string, unknown> | null;
    const url =
      (typeof data?.url === "string" && data.url) ||
      (typeof data?.checkoutUrl === "string" && data.checkoutUrl) ||
      (typeof data?.sessionUrl === "string" && data.sessionUrl) ||
      undefined;

    if (!url) {
      return {
        ok: false,
        message: "No checkout URL returned — check the server logs.",
      };
    }
    return { ok: true, url };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // Surface the backend's real error so we can see why checkout failed.
      console.error(
        "[payments/checkout] backend error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2),
      );
      const data = err.response?.data as { message?: string } | undefined;
      return {
        ok: false,
        message:
          data?.message ??
          `Checkout failed (${err.response?.status ?? "network error"}).`,
      };
    }
    console.error("[payments/checkout] action error:", err);
    return { ok: false, message: "Something went wrong starting checkout." };
  }
}
