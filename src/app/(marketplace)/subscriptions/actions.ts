"use server";
import axios from "axios";
import { headers } from "next/headers";
import { getBillingPortal } from "@/services/payments.service";

export interface PortalResult {
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

const NO_STRIPE_CUSTOMER =
  "There's nothing to manage here — your access was granted directly rather than paid for, so there's no billing to change.";

/**
 * Open the Stripe customer portal (manage card / invoices / cancel).
 *
 * Only works for access that came from a real Stripe purchase. An **admin-granted**
 * enrollment has no Stripe customer behind it, so the backend can't create a portal
 * session — it fails rather than returning a URL. That's expected, not a bug, so it gets
 * explanatory copy instead of "Something went wrong".
 */
export async function openBillingPortal(): Promise<PortalResult> {
  try {
    const origin = await getOrigin();
    const res = await getBillingPortal(`${origin}/subscriptions`);
    if (!res.success) {
      return { ok: false, message: res.message ?? NO_STRIPE_CUSTOMER };
    }
    const data = res.data as Record<string, unknown> | null;
    const url = typeof data?.url === "string" ? data.url : undefined;
    if (!url) {
      console.error("[billing-portal] no url in response:", JSON.stringify(res));
      return { ok: false, message: NO_STRIPE_CUSTOMER };
    }
    return { ok: true, url };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      console.error(
        "[billing-portal] backend error:",
        status,
        JSON.stringify(err.response?.data),
      );
      // 404 is the documented "no subscription" case; a 400/500 here is almost always the
      // same root cause (no Stripe customer for an admin-granted enrollment).
      if (status === 404 || status === 400 || status === 500) {
        return { ok: false, message: NO_STRIPE_CUSTOMER };
      }
      const data = err.response?.data as { message?: string } | undefined;
      return {
        ok: false,
        message:
          data?.message ??
          (status
            ? `Billing portal failed (${status}).`
            : "Couldn't reach the server. Please try again."),
      };
    }
    console.error("[billing-portal] action error:", err);
    return { ok: false, message: "Couldn't open billing." };
  }
}
