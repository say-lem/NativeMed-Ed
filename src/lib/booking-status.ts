import type { SessionBookingStatus } from "@/types/api";

/** `confirmed` is the expected steady state once Stripe pays out — no badge needed for it.
 *  `pending`/`cancelled` are worth calling out since a booking in either state isn't a
 *  real reservation yet (or anymore). */
export function bookingStatusMeta(
  status: SessionBookingStatus,
): { label: string; className: string } | null {
  switch (status) {
    case "pending":
      return { label: "Awaiting payment", className: "bg-amber-100 text-amber-700" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-gray-100 text-gray-500" };
    case "confirmed":
      return null;
  }
}
