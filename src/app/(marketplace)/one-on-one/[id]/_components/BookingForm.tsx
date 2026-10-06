"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { BookingProduct, BookingTimeSlot, User } from "@/types/api";
import { bookSessionAction } from "../actions";
import AvailabilityCalendar from "./AvailabilityCalendar";
import RequestSlotForm from "./RequestSlotForm";

/** yyyy-mm-dd from an ISO string, for the backend's `date` field. */
function toDateValue(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

/** "HH:mm" -> minutes since midnight, for same-day past/future comparison. */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function BookingForm({
  product,
  user,
}: {
  product: BookingProduct;
  user: User | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // UTC throughout, matching how dates are stored/compared everywhere else in this
  // feature (the backend strips dates to UTC midnight) — mixing in local time for "now"
  // would make the past/future line inconsistent with the date pool itself.
  const now = new Date();
  const todayValue = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  const isTimeBookable = (dateValue: string, t: BookingTimeSlot) =>
    t.isAvailable && (dateValue !== todayValue || toMinutes(t.time) > nowMinutes);

  // Drop dates entirely in the past, and — for today — dates whose every remaining time
  // has already gone. A user should never be offered a slot that's already elapsed.
  // Sorted soonest-first so the default selection (and the empty-state check below) picks
  // the nearest bookable date rather than whatever order the backend happened to return.
  // Not memoized: the list is small and this only needs to re-run on selection anyway.
  const dateEntries = product.availableDates
    .filter((d) => {
      const value = toDateValue(d.date);
      if (value < todayValue) return false;
      if (value === todayValue) return d.times.some((t) => isTimeBookable(value, t));
      return true;
    })
    .sort((a, b) => toDateValue(a.date).localeCompare(toDateValue(b.date)));

  const [date, setDate] = useState<string>(() =>
    dateEntries[0] ? toDateValue(dateEntries[0].date) : "",
  );

  const selectedEntry = dateEntries.find((d) => toDateValue(d.date) === date);

  const [time, setTime] = useState<string>(
    () => selectedEntry?.times.find((t) => isTimeBookable(date, t))?.time ?? "",
  );

  // Switching date can invalidate the chosen time — each date has its own per-time
  // availability (and its own past/future cutoff if it's today) — so fall back to that
  // date's first bookable time.
  const selectDate = (value: string) => {
    setDate(value);
    const entry = dateEntries.find((d) => toDateValue(d.date) === value);
    setTime(entry?.times.find((t) => isTimeBookable(value, t))?.time ?? "");
  };

  const submit = () => {
    // Defends against a stale page left open across the cutoff (e.g. past midnight, or
    // the clock ticking past the selected time while the form sat open).
    if (!selectedEntry || !isTimeBookable(date, { time, isAvailable: true })) {
      toast.error("That slot has already passed — pick another time.");
      router.refresh();
      return;
    }
    startTransition(async () => {
      const res = await bookSessionAction(
        product._id,
        { date, time },
        window.location.origin,
      );
      if (res.ok && res.url) {
        // The slot is only held, not booked, until Stripe confirms payment — send the
        // browser straight to checkout rather than showing a local "booked" state.
        window.location.assign(res.url);
        return;
      }
      toast.error(res.message ?? "Couldn't book that session.");
      router.refresh();
    });
  };

  if (dateEntries.length === 0) {
    return <RequestSlotForm productId={product._id} user={user} />;
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-black-others">Choose a date</p>
        <AvailabilityCalendar
          availableDates={dateEntries.map((d) => toDateValue(d.date))}
          selected={date}
          onSelect={selectDate}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-black-others">Choose a time</p>
        {/* Every one of the product's times renders here — ones already booked on THIS
            date, or already elapsed if this date is today, are shown struck-through and
            disabled rather than disappearing, so it's clear the slot exists but isn't
            bookable right now. */}
        <div className="flex flex-wrap gap-2">
          {(selectedEntry?.times ?? []).map((t) => {
            const bookable = isTimeBookable(date, t);
            const active = t.time === time;
            return (
              <button
                key={t.time}
                type="button"
                disabled={!bookable}
                onClick={() => setTime(t.time)}
                className={`rounded-[8px] border px-4 py-2 text-sm font-medium transition-colors ${
                  !bookable
                    ? "border-gray-1 text-gray-2 line-through cursor-not-allowed"
                    : active
                      ? "border-primary-100 bg-primary-10 text-primary-100"
                      : "border-gray-1 text-subtle-text hover:border-black-others"
                }`}
              >
                {t.time}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="button"
        onClick={submit}
        disabled={pending || !date || !time}
        className="w-full sm:w-auto font-bold text-sm sm:text-base bg-black-others disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? "Redirecting to payment..." : "Book Session"}
      </Button>
    </div>
  );
}
