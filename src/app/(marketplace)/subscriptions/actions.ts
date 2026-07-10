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

/** Open the Stripe customer portal (manage/cancel all subscriptions). */
export async function openBillingPortal(): Promise<PortalResult> {
  try {
    const origin = await getOrigin();
    const res = await getBillingPortal(`${origin}/subscriptions`);
    if (!res.success) {
      return { ok: false, message: res.message ?? "Couldn't open billing." };
    }
    const data = res.data as Record<string, unknown> | null;
    const url =
      (typeof data?.url === "string" && data.url) ||
      (typeof data?.portalUrl === "string" && data.portalUrl) ||
      undefined;
    if (!url) {
      return { ok: false, message: "No billing-portal URL returned." };
    }
    return { ok: true, url };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string } | undefined;
      return {
        ok: false,
        message:
          data?.message ??
          `Billing portal failed (${err.response?.status ?? "network error"}).`,
      };
    }
    console.error("[billing-portal] action error:", err);
    return { ok: false, message: "Something went wrong." };
  }
}
