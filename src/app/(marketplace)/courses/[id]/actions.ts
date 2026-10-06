"use server";
import { runCheckout, type CheckoutActionResult } from "@/lib/checkout";
import type { PaymentInterval } from "@/services/payments.service";

// NOTE: a "use server" module may only export async functions. Do NOT re-export the
// result type from here — it compiles to a runtime export that doesn't exist and the
// action module throws "CheckoutActionResult is not defined" on evaluation.
// Import the type from "@/lib/checkout" instead.

/** Kick off Stripe checkout for a course subscription and return the redirect URL. */
export async function startCourseCheckout(
  courseId: string,
  interval: PaymentInterval,
  clientOrigin?: string,
): Promise<CheckoutActionResult> {
  const res = await runCheckout(
    { type: "course", interval, courseId },
    "payments/checkout course",
    clientOrigin,
  );

  // Course-specific wording for the documented 404 / 409 cases.
  if (!res.ok && res.alreadySubscribed) {
    return {
      ...res,
      message:
        res.message ?? "You already have an active subscription for this course.",
    };
  }
  return res;
}
