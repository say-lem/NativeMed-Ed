import type { Subscription, SubscriptionStatus } from "@/types/api";

/**
 * Presentation + access rules for Stripe subscription statuses.
 *
 * The important one is `past_due`: Stripe is retrying the payment and the user **still
 * has access**, so it must read as a warning to fix their card, not as "expired".
 * Access itself is decided by the backend's `/status` endpoints — this is about how we
 * describe a subscription the user can see.
 */
export type StatusTone = "good" | "warn" | "dead";

interface StatusMeta {
  label: string;
  tone: StatusTone;
  /** Shown as a warning line on the card when set. */
  notice?: string;
}

const META: Record<string, StatusMeta> = {
  active: { label: "Active", tone: "good" },
  past_due: {
    label: "Payment due",
    tone: "warn",
    notice:
      "Your last payment failed. Update your card to keep access — we'll retry automatically.",
  },
  cancelled: { label: "Cancelled", tone: "dead" },
  canceled: { label: "Cancelled", tone: "dead" }, // Stripe's own spelling
  expired: { label: "Expired", tone: "dead" },
  incomplete: {
    label: "Incomplete",
    tone: "warn",
    notice: "This subscription was never completed. Try subscribing again.",
  },
};

/** True once the current billing period has actually elapsed. Stripe's webhook can lag
 *  behind the real date, so a backend-reported "active"/"past_due" can be stale — the tag
 *  shouldn't keep saying Active/Payment due past the date the subscription itself names. */
function isPastPeriodEnd(currentPeriodEnd?: string): boolean {
  if (!currentPeriodEnd) return false;
  return new Date(currentPeriodEnd).getTime() < Date.now();
}

export function statusMeta(
  status?: SubscriptionStatus,
  currentPeriodEnd?: string,
): StatusMeta {
  if (!status) return { label: "Unknown", tone: "dead" };
  const meta = META[status] ?? { label: status.replace(/_/g, " "), tone: "dead" };
  if ((status === "active" || status === "past_due") && isPastPeriodEnd(currentPeriodEnd)) {
    return { label: "Expired", tone: "dead" };
  }
  return meta;
}

/** Does this subscription currently grant access? `past_due` still does — unless its
 *  period has actually elapsed, in which case a stale status shouldn't keep it "active". */
export function grantsAccess(status?: SubscriptionStatus, currentPeriodEnd?: string): boolean {
  if (status !== "active" && status !== "past_due") return false;
  return !isPastPeriodEnd(currentPeriodEnd);
}

/** Subscriptions needing the user's attention — drives the page-level banner. */
export function needsAttention(subs: Subscription[]): Subscription[] {
  return subs.filter((s) => statusMeta(s.status, s.currentPeriodEnd).tone === "warn");
}
