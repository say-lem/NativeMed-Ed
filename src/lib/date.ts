import type { BookingAvailableDate } from "@/types/api";

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

/** Day number + short month, e.g. { day: "15", month: "Mar" } — for calendar-tile badges. */
export function formatDateParts(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "", month: "" };
  return { day: String(d.getUTCDate()), month: MONTHS[d.getUTCMonth()] };
}

/** A booking's `date` (UTC midnight) + `time` ("HH:mm", UTC) as a millisecond timestamp —
 *  matching the UTC convention used everywhere else in the booking feature. */
function bookingTimestamp(date: string, time: string): number {
  const d = new Date(date);
  const [h, m] = time.split(":").map(Number);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m);
}

/** A booking moves from "upcoming" to "past" one hour after its session start — not the
 *  instant it starts, so an in-progress session still counts as upcoming. */
export function isBookingPast(date: string, time: string): boolean {
  return Date.now() >= bookingTimestamp(date, time) + 60 * 60 * 1000;
}

/** Soonest-first comparator for anything with a booking `date`/`time`. */
export function byBookingTimeAsc(
  a: { date: string; time: string },
  b: { date: string; time: string },
): number {
  return bookingTimestamp(a.date, a.time) - bookingTimestamp(b.date, b.time);
}

/** True if a booking product's date entry still has at least one slot a user could book
 *  right now — unbooked AND not yet elapsed. The backend only pre-filters `availableDates`
 *  by booking status (unbooked), never by whether the date/time has already passed, so a
 *  raw `.length` on that array can count expired dates as "available". No grace period
 *  here (contrast `isBookingPast`, which gives an already-*booked* session an extra hour
 *  before it counts as past) — once a slot's start time arrives, it's no longer offerable. */
export function hasOpenSlot(d: BookingAvailableDate): boolean {
  return d.times.some((t) => t.isAvailable && bookingTimestamp(d.date, t.time) > Date.now());
}
