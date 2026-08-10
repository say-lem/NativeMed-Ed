import type { Course, CoursePricing, CourseTier, TierPricing } from "@/types/api";
import { TIER_ORDER } from "@/lib/tiers";

/**
 * Course price formatting + lookup.
 *
 * Course prices are **GBP pounds** (49.99) — unlike `PlanPrice.amount` and `/payments/me`,
 * which are pence. Never divide these by 100.
 *
 * Since 2026-08-10 pricing is **per access tier**: `pricing[tier][interval]`. Everything
 * here treats a missing tier or interval as "not offered" rather than free — checkout 400s
 * on a combination the course doesn't price. Verified against live data: some courses have
 * only one tier priced, and some have no `pricing` object at all.
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

function tierPricing(
  pricing: CoursePricing | undefined,
  tier: CourseTier,
): TierPricing | undefined {
  return pricing?.[tier];
}

/** Price for one tier + interval, or undefined when that combination isn't sold. */
export function priceFor(
  course: Course,
  tier: CourseTier,
  interval: string,
): number | undefined {
  const t = tierPricing(course.pricing, tier);
  if (!t) return undefined;
  const value = interval === "monthly" ? t.monthly : t.quarterly;
  return typeof value === "number" ? value : undefined;
}

/** Intervals this tier can be bought on. Empty = tier not purchasable. */
export function intervalsForTier(course: Course, tier: CourseTier): string[] {
  return INTERVALS.filter((iv) => priceFor(course, tier, iv) != null);
}

/** Tiers with at least one price — the only ones we may offer for sale. */
export function purchasableTiers(course: Course): CourseTier[] {
  return TIER_ORDER.filter((t) => intervalsForTier(course, t).length > 0);
}

/** Is any tier/interval on sale at all? */
export function isPurchasable(course: Course): boolean {
  return purchasableTiers(course).length > 0;
}

/** Cheapest price across every tier and interval — for "from £X" card badges. */
function lowestPrice(course: Course): { amount: number; interval: string } | null {
  let best: { amount: number; interval: string } | null = null;
  for (const tier of TIER_ORDER) {
    for (const interval of INTERVALS) {
      const amount = priceFor(course, tier, interval);
      if (amount == null) continue;
      if (!best || amount < best.amount) best = { amount, interval };
    }
  }
  return best;
}

/**
 * Compact label for cards/badges. Shows the cheapest option, since a course can now have
 * up to four prices and a card only has room for one.
 */
export function courseBadgePrice(course: Course): string {
  const low = lowestPrice(course);
  if (!low) return "—";
  const suffix = INTERVAL_SHORT[low.interval] ?? low.interval;
  const prefix = purchasableTiers(course).length > 1 ? "from " : "";
  return `${prefix}${formatMoney(low.amount)}/${suffix}`;
}

const SHORT_TIER: Record<CourseTier, string> = {
  mocksessions_only: "Sessions",
  mocksession_and_lectures: "+ Lectures",
};

/**
 * Priced combinations as structured rows, one per tier — for admin lists.
 *
 * Returned as data rather than a single string: with two tiers × two intervals the flat
 * string ran to ~60 characters and wrapped over six lines inside a card, pushing the action
 * buttons out of the layout. Callers render it as a compact two-row block instead.
 */
export function coursePriceRows(
  course: Course,
): { tier: CourseTier; label: string; prices: string }[] {
  return TIER_ORDER.flatMap((tier) => {
    const intervals = intervalsForTier(course, tier);
    if (intervals.length === 0) return [];
    const prices = intervals
      .map((iv) => {
        const amount = priceFor(course, tier, iv);
        return amount == null
          ? null
          : `${formatMoney(amount)}/${INTERVAL_SHORT[iv] ?? iv}`;
      })
      .filter(Boolean)
      .join(" · ");
    return [{ tier, label: SHORT_TIER[tier], prices }];
  });
}
