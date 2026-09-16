"use client";
import { useState } from "react";
import { bookingStatusMeta } from "@/lib/booking-status";
import { byBookingTimeAsc, formatDate, isBookingPast } from "@/lib/date";
import { formatMoney } from "@/lib/price";
import type { AdminSessionBooking } from "@/types/api";

type View = "upcoming" | "past";

const rowGrid = "grid grid-cols-[1fr_1.4fr_120px_90px_110px] items-center gap-6";

export default function BookingsList({ bookings }: { bookings: AdminSessionBooking[] }) {
  const [view, setView] = useState<View>("upcoming");

  // A booking counts as upcoming until an hour after its start time, so an in-progress
  // session doesn't immediately drop into the past list.
  const upcoming = bookings.filter((b) => !isBookingPast(b.date, b.time)).sort(byBookingTimeAsc);
  const past = bookings
    .filter((b) => isBookingPast(b.date, b.time))
    .sort((a, b) => byBookingTimeAsc(b, a));

  const shown = view === "upcoming" ? upcoming : past;

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-black-others">All bookings ({bookings.length})</h2>
        <div className="inline-flex rounded-[8px] border border-[#EDEDED] p-1 bg-gray-50">
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
              className={`px-4 py-1.5 rounded-[6px] text-sm font-semibold cursor-pointer ${
                view === t.id ? "bg-white shadow-sm text-primary-100" : "text-subtle-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="text-center text-subtle-text py-10">
          {view === "upcoming" ? "No upcoming bookings." : "No past bookings."}
        </p>
      ) : (
        <div className="overflow-x-auto mt-5">
          <div className="min-w-[700px] flex flex-col">
            <div className={`${rowGrid} bg-primary-10 rounded-[8px] px-4 py-3`}>
              <span className="text-sm font-semibold text-black-others">Booked By</span>
              <span className="text-sm font-semibold text-black-others">Session</span>
              <span className="text-sm font-semibold text-black-others">Date</span>
              <span className="text-sm font-semibold text-black-others">Time</span>
              <span className="text-sm font-semibold text-black-others">Status</span>
            </div>
            {shown.map((booking) => {
              const statusMeta = bookingStatusMeta(booking.status);
              return (
                <div key={booking._id} className={`${rowGrid} border-b border-[#EDEDED] px-4 py-4`}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black-others truncate">
                      {booking.userId?.fullName ?? "Deleted user"}
                    </p>
                    <p className="text-xs text-subtle-text truncate">
                      {booking.userId?.email ?? "—"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-black-others truncate">
                      {booking.productId?.title ?? "Deleted product"}
                    </p>
                    {booking.productId && (
                      <p className="text-xs text-subtle-text">
                        {formatMoney(booking.productId.price)}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-black-others whitespace-nowrap">
                    {formatDate(booking.date)}
                  </p>
                  <p className="text-sm text-black-others whitespace-nowrap">{booking.time}</p>
                  <div>
                    {statusMeta ? (
                      <span
                        className={`rounded-full text-xs font-semibold px-2.5 py-1 ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    ) : (
                      <span className="rounded-full text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700">
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
