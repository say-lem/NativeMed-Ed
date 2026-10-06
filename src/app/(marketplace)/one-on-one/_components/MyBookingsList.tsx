"use client";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { bookingStatusMeta } from "@/lib/booking-status";
import { byBookingTimeAsc, formatDate, isBookingPast } from "@/lib/date";
import { formatMoney } from "@/lib/price";
import type { MyBooking } from "@/types/api";

type View = "upcoming" | "past";

function BookingCard({ booking, past }: { booking: MyBooking; past: boolean }) {
  const statusMeta = bookingStatusMeta(booking.status);
  return (
    <div
      className={`rounded-[16px] courseBorder p-4 sm:p-5 bg-white flex flex-col gap-3 ${
        past ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="grid place-items-center size-11 rounded-full bg-primary-10 text-primary-100 shrink-0">
          <CalendarClock size={20} />
        </span>
        <div className="flex items-center gap-1.5">
          {statusMeta && (
            <span
              className={`rounded-full text-xs font-semibold px-3 py-1.5 ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          )}
          {booking.productId && (
            <span className="rounded-full bg-black-others text-white text-xs font-semibold px-3 py-1.5">
              {formatMoney(booking.productId.price)}
            </span>
          )}
        </div>
      </div>

      <p className="text-base sm:text-lg font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
        {booking.productId?.title ?? "Session no longer available"}
      </p>

      <div className="mt-auto pt-2 border-t border-[#EDEDED] flex items-center justify-between text-sm">
        <span className="text-black-others font-medium">{formatDate(booking.date)}</span>
        <span className="text-subtle-text">{booking.time}</span>
      </div>
    </div>
  );
}

export default function MyBookingsList({ bookings }: { bookings: MyBooking[] }) {
  const [view, setView] = useState<View>("upcoming");

  if (bookings.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
        You haven&apos;t booked any 1-on-1 sessions yet.
      </div>
    );
  }

  // A booking counts as upcoming until an hour after its start time, so an in-progress
  // session doesn't immediately drop into the past list.
  const upcoming = bookings.filter((b) => !isBookingPast(b.date, b.time)).sort(byBookingTimeAsc);
  const past = bookings
    .filter((b) => isBookingPast(b.date, b.time))
    .sort((a, b) => byBookingTimeAsc(b, a));

  const shown = view === "upcoming" ? upcoming : past;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 space-y-6">
      <div className="inline-flex rounded-full border border-primary-20 p-1 bg-[rgba(245,239,255,0.5)]">
        {(
          [
            { id: "upcoming", label: `Upcoming (${upcoming.length})` },
            { id: "past", label: `Past (${past.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setView(t.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
              view === t.id
                ? "bg-primary-100 text-white"
                : "text-secondary-100 hover:text-primary-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-subtle-text py-6">
          {view === "upcoming" ? "No upcoming sessions booked." : "No past sessions yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-9">
          {shown.map((booking) => (
            <BookingCard key={booking._id} booking={booking} past={view === "past"} />
          ))}
        </div>
      )}
    </div>
  );
}
