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

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "0.0.0.0"]);

function firstHeader(value: string | null): string | null {
  if (!value) return null;
  return value.split(",")[0]?.trim() || null;
}

function originFromUrlish(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function isLoopbackOrigin(origin: string): boolean {
  try {
    return LOOPBACK_HOSTS.has(new URL(origin).hostname);
  } catch {
    return true;
  }
}

function originFromHost(host: string | null, protoHint: string | null): string | null {
  if (!host) return null;
  const hostname = host.replace(/:\d+$/, "").replace(/^\[(.*)\]$/, "$1");
  const proto =
    protoHint === "http" || protoHint === "https"
      ? protoHint
      : LOOPBACK_HOSTS.has(hostname)
        ? "http"
        : "https";
  return originFromUrlish(`${proto}://${host}`);
}

function envOrigin(): string | null {
  const explicit =
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL;
  const parsed = originFromUrlish(explicit ?? null);
  if (parsed) return parsed;
  if (process.env.VERCEL_URL) {
    return originFromUrlish(`https://${process.env.VERCEL_URL}`);
  }
  return null;
}

/** Absolute origin of the current request, for Stripe's return URLs. Exported for other
 *  checkout flows outside `runCheckout` (e.g. booking) that need to build their own
 *  success/cancel URLs.
 *
 *  Next.js Server Actions often see `host` / `x-forwarded-host` as `localhost` even on
 *  Vercel. Prefer the browser `Origin`/`Referer` and an explicit `clientOrigin` (from
 *  `window.location.origin`) so Stripe sends users back to the site they paid from. */
export async function getOrigin(clientOrigin?: string): Promise<string> {
  const h = await headers();
  const proto = firstHeader(h.get("x-forwarded-proto"));

  const candidates = [
    originFromUrlish(h.get("origin")),
    originFromUrlish(h.get("referer")),
    originFromUrlish(clientOrigin),
    originFromHost(firstHeader(h.get("x-forwarded-host")), proto),
    originFromHost(firstHeader(h.get("host")), proto),
    envOrigin(),
  ];

  const publicOrigin = candidates.find(
    (origin): origin is string => !!origin && !isLoopbackOrigin(origin),
  );
  if (publicOrigin) return publicOrigin;

  const anyOrigin = candidates.find((origin): origin is string => !!origin);
  return anyOrigin ?? "http://localhost:3000";
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
  clientOrigin?: string,
): Promise<CheckoutActionResult> {
  try {
    const origin = await getOrigin(clientOrigin);

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
