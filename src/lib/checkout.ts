import "server-only";
import axios from "axios";
import { headers } from "next/headers";
import { createCheckout, type CheckoutInput } from "@/services/payments.service";

export interface CheckoutActionResult {
  ok: boolean;
  url?: string;
  message?: string;
  /** 409 — an active subscription already exists; offer billing management instead. */
  alreadySubscribed?: boolean;
}

/** Absolute origin of the current request, for Stripe's return URLs. */
async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/**
 * Create a Stripe Checkout session and return its hosted-page URL.
 *
 * Shared by the course and Case Bank flows — the only difference between them is the
 * payload, and both need identical response parsing and error mapping.
 *
 * Response shape confirmed 2026-08-07: `data: { sessionId, url }`. We redirect to `url`,
 * so Stripe.js and the publishable key aren't needed.
 */
export async function runCheckout(
  payload: Omit<CheckoutInput, "successUrl" | "cancelUrl">,
  logLabel: string,
): Promise<CheckoutActionResult> {
  try {
    const origin = await getOrigin();

    // Tell the success page what was bought so it can poll the right status endpoint.
    // `{CHECKOUT_SESSION_ID}` is a Stripe placeholder — it must stay literal, so it's
    // appended by hand rather than through URLSearchParams (which would escape the braces).
    const ctx = new URLSearchParams({ type: payload.type });
    if (payload.courseId) ctx.set("courseId", payload.courseId);
    const successUrl =
      `${origin}/payment/success?${ctx.toString()}` +
      `&session_id={CHECKOUT_SESSION_ID}`;

    const res = await createCheckout({
      ...payload,
      successUrl,
      cancelUrl: `${origin}/payment/cancel`,
    });

    if (!res.success) {
      return { ok: false, message: res.message ?? "Checkout failed." };
    }

    const data = res.data as { url?: unknown } | null;
    const url = typeof data?.url === "string" ? data.url : undefined;

    if (!url) {
      console.error(`[${logLabel}] no url in response:`, JSON.stringify(res));
      return {
        ok: false,
        message: "Checkout couldn't be started. Please try again.",
      };
    }
    return { ok: true, url };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as { message?: string } | undefined;
      console.error(
        `[${logLabel}] backend error:`,
        status,
        JSON.stringify(err.response?.data),
      );

      // Documented failures worth phrasing for the user rather than echoing raw.
      if (status === 409) {
        return {
          ok: false,
          alreadySubscribed: true,
          message: data?.message ?? "You already have an active subscription.",
        };
      }
      if (status === 404) {
        return { ok: false, message: "This item is no longer available." };
      }

      return {
        ok: false,
        message:
          data?.message ??
          (status
            ? `Checkout failed (${status}).`
            : "Couldn't reach the server. Please try again."),
      };
    }
    console.error(`[${logLabel}] action error:`, err);
    return { ok: false, message: "Something went wrong starting checkout." };
  }
}
