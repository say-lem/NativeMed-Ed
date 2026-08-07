import type { CourseTier } from "@/types/api";

/**
 * Course access tiers. Renamed by the backend 2026-08-07:
 * `pdf_only` → `mocksessions_only`, `pdf_drive` → `mocksession_and_lectures`.
 * Backend is migrating existing records, so we only speak the new names — `tierLabel`
 * falls back to the raw value, so a stale record degrades to readable text.
 *
 * The tier controls WHICH Drive materials a subscriber gets, not the billing interval.
 */
export const TIER_LABEL: Record<CourseTier, string> = {
  mocksessions_only: "Mock Sessions Only",
  mocksession_and_lectures: "Mock Sessions + Lectures",
};

/** Cheapest-first, for consistent ordering of tier pickers and lists. */
export const TIER_ORDER: CourseTier[] = [
  "mocksessions_only",
  "mocksession_and_lectures",
];

/** Human label for a tier, tolerating unknown/legacy values. */
export function tierLabel(tier?: string | null): string {
  if (!tier) return "—";
  return TIER_LABEL[tier as CourseTier] ?? tier;
}

/** Does this tier include the lectures folder (the higher of the two)? */
export function includesLectures(tier?: string | null): boolean {
  return tier === "mocksession_and_lectures";
}

/** Sort comparator putting `mocksessions_only` first. */
export function byTierOrder(a?: string, b?: string): number {
  const ia = TIER_ORDER.indexOf(a as CourseTier);
  const ib = TIER_ORDER.indexOf(b as CourseTier);
  return (ia === -1 ? TIER_ORDER.length : ia) - (ib === -1 ? TIER_ORDER.length : ib);
}
