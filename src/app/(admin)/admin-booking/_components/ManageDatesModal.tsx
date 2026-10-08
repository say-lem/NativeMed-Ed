"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import { formatDate, isBookingPast } from "@/lib/date";
import type { AdminBookingProduct } from "@/types/api";
import {
  addAvailableDateAction,
  addAvailableDateRangeAction,
  removeAvailableDateAction,
} from "../actions";

const inputClass =
  "border-[0.5px] rounded-[8px] px-4 py-2.5 border-secondary-20 w-full outline-none focus:border-primary-100 text-black-others";

type Mode = "single" | "range";

/** UTC yyyy-mm-dd, matching how dates are stored — used as the date inputs' `min` so a
 *  past date can't be added to the pool in the first place. */
function todayValue(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

export default function ManageDatesModal({
  product,
  onClose,
}: {
  product: AdminBookingProduct;
  onClose: () => void;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [mode, setMode] = useState<Mode>("single");
  const [date, setDate] = useState("");
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [adding, startAdd] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startRemove] = useTransition();

  const dates = product.availableDates ?? [];
  const times = product.availableTimes ?? [];
  const sorted = [...dates].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const hasOpenDate = dates.some((d) =>
    times.some(
      (t) => !(d.bookedTimes ?? []).includes(t) && !isBookingPast(d.date, t),
    ),
  );
  // No `availableTimes` at all makes the `.some()` above vacuously false for every date
  // no matter how far in the future it is — that's "no times configured", not "expired".
  const noTimesConfigured = times.length === 0;
  const allDatesExpired = !noTimesConfigured && !hasOpenDate && dates.length > 0;

  const add = () => {
    if (!date) {
      toast.error("Choose a date first");
      return;
    }
    startAdd(async () => {
      const res = await addAvailableDateAction(product._id, date);
      if (res.ok) {
        toast.success(res.message ?? "Date added");
        setDate("");
        router.refresh();
      } else {
        toast.error(res.message ?? "Couldn't add the date.");
      }
    });
  };

  const addRange = () => {
    if (!rangeFrom || !rangeTo) {
      toast.error("Choose both a start and end date");
      return;
    }
    startAdd(async () => {
      const res = await addAvailableDateRangeAction(product._id, rangeFrom, rangeTo);
      if (res.ok) {
        toast.success(res.message ?? "Dates added");
        setRangeFrom("");
        setRangeTo("");
        router.refresh();
      } else {
        toast.error(res.message ?? "Couldn't add that range.");
      }
    });
  };

  const remove = async (dateId: string, label: string) => {
    const ok = await confirm({
      title: "Remove this date?",
      message: `${label} will no longer be available to book.`,
      confirmText: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(dateId);
    startRemove(async () => {
      const res = await removeAvailableDateAction(product._id, dateId);
      if (res.ok) toast.success(res.message ?? "Date removed");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 cursor-default"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-subtle-text hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-black-others">Manage Dates</h2>
        <p className="mt-1 text-sm text-subtle-text">{product.title}</p>
        {noTimesConfigured ? (
          <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle size={12} />
            This product has no session times configured — edit it to add some before
            dates here can be booked.
          </p>
        ) : (
          allDatesExpired && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <AlertTriangle size={12} />
              Every date below has passed — add a new one to make this bookable again.
            </p>
          )
        )}

        <div className="mt-5 inline-flex rounded-[8px] border border-[#EDEDED] p-1 bg-gray-50">
          {(["single", "range"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-[6px] text-sm font-medium cursor-pointer ${
                mode === m ? "bg-white shadow-sm text-primary-100" : "text-subtle-text"
              }`}
            >
              {m === "single" ? "Single Date" : "Date Range"}
            </button>
          ))}
        </div>

        {mode === "single" ? (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="date"
              min={todayValue()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={add}
              disabled={adding}
              className="shrink-0 grid place-items-center size-10 rounded-[8px] bg-primary-100 text-white cursor-pointer disabled:opacity-60"
              aria-label="Add date"
            >
              {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-subtle-text">From</label>
                <input
                  type="date"
                  min={todayValue()}
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-subtle-text">To</label>
                <input
                  type="date"
                  min={rangeFrom || todayValue()}
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addRange}
              disabled={adding}
              className="w-full flex items-center justify-center gap-1.5 rounded-[8px] bg-primary-100 text-white text-sm font-semibold py-2.5 cursor-pointer disabled:opacity-60"
            >
              {adding && <Loader2 size={14} className="animate-spin" />}
              {adding ? "Adding..." : "Add Every Date in Range"}
            </button>
            <p className="text-xs text-subtle-text">
              Adds every day from start to end, inclusive. Dates already in the pool are
              skipped automatically.
            </p>
          </div>
        )}

        <div className="mt-5 divide-y divide-[#EDEDED] max-h-[300px] overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="text-center text-subtle-text py-6 text-sm">No dates added yet.</p>
          ) : (
            sorted.map((d) => {
              const busy = busyId === d._id;
              const label = formatDate(d.date);
              const bookedTimes = d.bookedTimes ?? [];
              const hasBookings = bookedTimes.length > 0;
              // Expired = every configured time on this date has already passed — distinct
              // from "booked"; a date can clear the old bookedTimes check yet still be
              // unbookable because the clock has simply moved past it (see BookingProductsManager).
              const expired =
                times.length > 0 && times.every((t) => isBookingPast(d.date, t));
              return (
                <div key={d._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <span className="text-sm text-black-others">{label}</span>
                    {expired && (
                      <span className="ml-2 rounded-full bg-amber-50 text-amber-700 text-xs px-2 py-0.5">
                        Expired
                      </span>
                    )}
                    {times.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {times.map((time) => {
                          const isBooked = bookedTimes.includes(time);
                          const isPast = !isBooked && isBookingPast(d.date, time);
                          return (
                            <span
                              key={time}
                              className={`text-xs rounded-full px-2 py-0.5 ${
                                isBooked
                                  ? "bg-gray-100 text-subtle-text line-through"
                                  : isPast
                                    ? "bg-amber-50 text-amber-700 line-through"
                                    : "bg-primary-10 text-primary-100"
                              }`}
                            >
                              {time}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(d._id, label)}
                    disabled={busy || hasBookings}
                    title={hasBookings ? "Dates with bookings can't be removed here" : "Remove date"}
                    className="shrink-0 grid place-items-center size-8 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
