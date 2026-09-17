import type { Course } from "@/types/api";

/**
 * Course price formatting + lookup.
 *
 * Course prices are **GBP pounds** (49.99) — unlike `PlanPrice.amount` and `/payments/me`,
 * which are pence. Never divide these by 100.
 *
 * Pricing is flat (`pricing.monthly` / `pricing.quarterly`) — courses no longer have
 * access tiers. A missing interval means it isn't offered, not free; checkout 400s on an
 * interval the course doesn't price. Some courses have no `pricing` object at all.
 */
export function formatMoney(amount: number): string {
  return `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const INTERVAL_SHORT: Record<string, string> = {
  monthly: "mo",
  quarterly: "qtr",
};

export const INTERVAL_LONG: Record<string, string> = {
  monthly: "month",
  quarterly: "quarter",
};

export const INTERVALS: string[] = ["monthly", "quarterly"];

/** Price for one interval, or undefined when that interval isn't sold. */
export function priceFor(course: Course, interval: string): number | undefined {
  const value =
    interval === "monthly" ? course.pricing?.monthly : course.pricing?.quarterly;
  return typeof value === "number" ? value : undefined;
}

/** Intervals this course can be bought on. Empty = not purchasable. */
export function purchasableIntervals(course: Course): string[] {
  return INTERVALS.filter((iv) => priceFor(course, iv) != null);
}

/** Is any interval on sale at all? */
export function isPurchasable(course: Course): boolean {
  return purchasableIntervals(course).length > 0;
}

/** Cheapest priced interval — for "from £X" card badges. */
function lowestPrice(course: Course): { amount: number; interval: string } | null {
  let best: { amount: number; interval: string } | null = null;
  for (const interval of INTERVALS) {
    const amount = priceFor(course, interval);
    if (amount == null) continue;
    if (!best || amount < best.amount) best = { amount, interval };
  }
  return best;
}

/**
 * Compact label for cards/badges. Shows the cheapest option — "from £X/mo" when both
 * intervals are priced (quarterly is usually cheaper per-month but a bigger one-off charge,
 * so "from" still applies), or the exact price when only one interval is offered.
 */
export function courseBadgePrice(course: Course): string {
  const low = lowestPrice(course);
  if (!low) return "—";
  const suffix = INTERVAL_SHORT[low.interval] ?? low.interval;
  const prefix = purchasableIntervals(course).length > 1 ? "from " : "";
  return `${prefix}${formatMoney(low.amount)}/${suffix}`;
}

/** Priced intervals as a compact string, e.g. "£49.99/mo · £129.99/qtr" — for admin lists. */
export function coursePriceLabel(course: Course): string {
  const intervals = purchasableIntervals(course);
  if (intervals.length === 0) return "—";
  return intervals
    .map((iv) => `${formatMoney(priceFor(course, iv)!)}/${INTERVAL_SHORT[iv] ?? iv}`)
    .join(" · ");
}
