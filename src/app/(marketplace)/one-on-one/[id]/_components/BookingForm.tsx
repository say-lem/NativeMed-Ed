"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import type { BookingProduct } from "@/types/api";
import { bookSessionAction } from "../actions";

/** yyyy-mm-dd from an ISO string, for the backend's `date` field. */
function toDateValue(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function BookingForm({ product }: { product: BookingProduct }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [booked, setBooked] = useState(false);
  const openDates = product.availableDates.filter((d) => !d.isBooked);
  const [date, setDate] = useState<string>(() => (openDates[0] ? toDateValue(openDates[0].date) : ""));
  const [time, setTime] = useState<string>(() => product.availableTimes[0] ?? "");

  const submit = () => {
    startTransition(async () => {
      const res = await bookSessionAction(product._id, { date, time });
      if (res.ok) {
        toast.success(res.message ?? "Session booked");
        setBooked(true);
        router.refresh();
      } else {
        toast.error(res.message ?? "Couldn't book that session.");
      }
    });
  };

  if (booked) {
    return (
      <div className="flex flex-col items-center text-center gap-3 rounded-[16px] border border-primary-20 p-6 sm:p-8">
        <CheckCircle2 className="size-12 text-green-500" />
        <h3 className="text-lg font-semibold text-black-others">Session booked</h3>
        <p className="text-subtle-text text-sm leading-[150%] max-w-sm">
          We&apos;ll be in touch by email to confirm your {formatDate(date)} session at {time}.
        </p>
      </div>
    );
  }

  if (openDates.length === 0) {
    return (
      <p className="text-sm text-subtle-text">
        No dates are currently available for this session. Please check back soon.
      </p>
    );
  }

  if (product.availableTimes.length === 0) {
    return (
      <p className="text-sm text-subtle-text">
        This session has no time slots configured yet. Please check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-black-others">Choose a date</p>
        <div className="flex flex-wrap gap-2">
          {openDates.map((d) => {
            const value = toDateValue(d.date);
            const active = value === date;
            return (
              <button
                key={d._id}
                type="button"
                onClick={() => setDate(value)}
                className={`rounded-[8px] border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary-100 bg-primary-10 text-primary-100"
                    : "border-gray-1 text-subtle-text hover:border-black-others"
                }`}
              >
                {formatDate(d.date)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-black-others">Choose a time</p>
        <div className="flex flex-wrap gap-2">
          {product.availableTimes.map((t) => {
            const active = t === time;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`rounded-[8px] border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary-100 bg-primary-10 text-primary-100"
                    : "border-gray-1 text-subtle-text hover:border-black-others"
                }`}
              >
                {t}
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
        {pending ? "Booking..." : "Book Session"}
      </Button>
    </div>
  );
}
