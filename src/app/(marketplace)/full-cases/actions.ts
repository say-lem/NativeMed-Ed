"use server";
import axios from "axios";
import { headers } from "next/headers";
import { createCheckout } from "@/services/payments.service";

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

/** Kick off Stripe checkout for the Case Bank subscription (unlocks all cases). */
export async function startCaseBankCheckout(
  interval = "monthly",
): Promise<CheckoutActionResult> {
  try {
    const origin = await getOrigin();
    const res = await createCheckout({
      type: "case_bank",
      interval,
      successUrl: `${origin}/payment/success`,
      cancelUrl: `${origin}/payment/cancel`,
    });

    if (!res.success) {
      return { ok: false, message: res.message ?? "Checkout failed." };
    }

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
      console.error(
        "[payments/checkout case_bank] backend error:",
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
    console.error("[payments/checkout case_bank] action error:", err);
    return { ok: false, message: "Something went wrong starting checkout." };
  }
}
