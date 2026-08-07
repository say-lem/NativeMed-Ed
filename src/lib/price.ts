import type { Course } from "@/types/api";

/**
 * Course price formatting. Course prices are in **GBP pounds** (e.g. 49.99) — unlike
 * `PlanPrice.amount` and payment history, which are in pence.
 *
 * A missing price means that interval **is not offered**, not that it's free: the backend
 * requires at least one of monthly/quarterly, and checkout 400s on an interval the course
 * doesn't have.
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

/** Compact single label for cards/badges — prefers monthly, falls back to quarterly. */
export function courseBadgePrice(course: Course): string {
  if (course.priceMonthly != null)
    return `${formatMoney(course.priceMonthly)}/${INTERVAL_SHORT.monthly}`;
  if (course.priceQuarterly != null)
    return `${formatMoney(course.priceQuarterly)}/${INTERVAL_SHORT.quarterly}`;
  return "—";
}

/** Both intervals, for admin lists. */
export function courseAdminPrice(course: Course): string {
  const parts: string[] = [];
  if (course.priceMonthly != null)
    parts.push(`${formatMoney(course.priceMonthly)}/${INTERVAL_SHORT.monthly}`);
  if (course.priceQuarterly != null)
    parts.push(
      `${formatMoney(course.priceQuarterly)}/${INTERVAL_SHORT.quarterly}`,
    );
  return parts.length ? parts.join(" · ") : "—";
}

/** Intervals this course can actually be bought on — drives the checkout picker. */
export function availableIntervals(course: Course): string[] {
  const out: string[] = [];
  if (course.priceMonthly != null) out.push("monthly");
  if (course.priceQuarterly != null) out.push("quarterly");
  return out;
}

/** Price for a specific interval, or undefined if not offered. */
export function priceForInterval(
  course: Course,
  interval: string,
): number | undefined {
  if (interval === "monthly") return course.priceMonthly;
  if (interval === "quarterly") return course.priceQuarterly;
  return undefined;
}
