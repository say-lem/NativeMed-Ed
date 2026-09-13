import { formatDate } from "@/lib/date";
import { formatMoney } from "@/lib/price";
import type { AdminSessionBooking } from "@/types/api";

const rowGrid = "grid grid-cols-[1fr_1.4fr_120px_90px] items-center gap-6";

export default function BookingsList({ bookings }: { bookings: AdminSessionBooking[] }) {
  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-black-others">
        All bookings ({bookings.length})
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-subtle-text py-10">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto mt-5">
          <div className="min-w-[700px] flex flex-col">
            <div className={`${rowGrid} bg-primary-10 rounded-[8px] px-4 py-3`}>
              <span className="text-sm font-semibold text-black-others">Booked By</span>
              <span className="text-sm font-semibold text-black-others">Session</span>
              <span className="text-sm font-semibold text-black-others">Date</span>
              <span className="text-sm font-semibold text-black-others">Time</span>
            </div>
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className={`${rowGrid} border-b border-[#EDEDED] px-4 py-4`}
              >
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
