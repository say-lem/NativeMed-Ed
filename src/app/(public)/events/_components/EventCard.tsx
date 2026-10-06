import EventDetails from "@/components/shared/EventDetails";
import { formatDateParts } from "@/lib/date";
import type { Activity } from "@/types/api";

export default function EventCard({ event }: { event: Activity }) {
  const { day, month } = formatDateParts(event.date);

  return (
    <div className="flex gap-4 items-start py-4 px-4 sm:py-5 sm:px-6 rounded-[16px] bg-[rgba(245,239,255,0.7)] border border-[rgba(155,124,209,0.4)]">
      <div className="shrink-0 flex flex-col items-center justify-center rounded-[12px] bg-white w-14 h-14 sm:w-16 sm:h-16">
        <span className="font-semibold text-lg sm:text-xl leading-none text-primary-100">
          {day}
        </span>
        <span className="text-[11px] sm:text-xs uppercase tracking-wide text-primary-100">
          {month}
        </span>
      </div>
      <EventDetails event={event} />
    </div>
  );
}
