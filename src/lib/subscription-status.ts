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

export function statusMeta(status?: SubscriptionStatus): StatusMeta {
  if (!status) return { label: "Unknown", tone: "dead" };
  return META[status] ?? { label: status.replace(/_/g, " "), tone: "dead" };
}

/** Does this subscription currently grant access? `past_due` still does. */
export function grantsAccess(status?: SubscriptionStatus): boolean {
  return status === "active" || status === "past_due";
}

/** Subscriptions needing the user's attention — drives the page-level banner. */
export function needsAttention(subs: Subscription[]): Subscription[] {
  return subs.filter((s) => statusMeta(s.status).tone === "warn");
}
