import { CalendarClock } from "lucide-react";
import { formatDate } from "@/lib/date";
import { formatMoney } from "@/lib/price";
import type { MyBooking } from "@/types/api";

export default function MyBookingsList({ bookings }: { bookings: MyBooking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
        You haven&apos;t booked any 1-on-1 sessions yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-9 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="rounded-[16px] courseBorder p-4 sm:p-5 bg-white flex flex-col gap-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="grid place-items-center size-11 rounded-full bg-primary-10 text-primary-100 shrink-0">
              <CalendarClock size={20} />
            </span>
            {booking.productId && (
              <span className="rounded-full bg-black-others text-white text-xs font-semibold px-3 py-1.5">
                {formatMoney(booking.productId.price)}
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
            {booking.productId?.title ?? "Session no longer available"}
          </p>

          <div className="mt-auto pt-2 border-t border-[#EDEDED] flex items-center justify-between text-sm">
            <span className="text-black-others font-medium">{formatDate(booking.date)}</span>
            <span className="text-subtle-text">{booking.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
