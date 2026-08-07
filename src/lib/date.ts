const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Short date, e.g. "7 Aug 2026".
 *
 * Deliberately formatted in **UTC** rather than via `toLocaleDateString`: these strings are
 * rendered on the server and hydrated on the client, and a locale/timezone-dependent format
 * produces a hydration mismatch.
 */
export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
