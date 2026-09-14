"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** UTC-based, matching the backend's day-stripped date storage — avoids local-timezone
 *  off-by-one days when the viewer isn't in UTC. */
function toDateValue(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AvailabilityCalendar({
  availableDates,
  selected,
  onSelect,
}: {
  /** yyyy-mm-dd values that are selectable. */
  availableDates: string[];
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  const available = useMemo(() => new Set(availableDates), [availableDates]);

  // Belt-and-suspenders: the caller is expected to have already excluded past dates
  // (`BookingForm` does, accounting for today's per-time cutoff too), but a bare date
  // is never selectable here regardless of what's in `availableDates`.
  const todayValue = useMemo(() => {
    const now = new Date();
    return toDateValue(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }, []);

  const [view, setView] = useState(() => {
    const first = [...available].sort()[0];
    const d = first ? new Date(`${first}T00:00:00Z`) : new Date();
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
  });

  const daysInMonth = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(view.year, view.month, 1)).getUTCDay();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const changeMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(Date.UTC(v.year, v.month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });
  };

  return (
    <div className="rounded-[16px] border border-gray-1 p-4 sm:p-5 w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
          className="grid place-items-center size-8 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-black-others">
          {MONTH_NAMES[view.month]} {view.year}
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
          className="grid place-items-center size-8 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-xs text-subtle-text font-medium py-1">
            {w}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day == null) return <span key={`b-${i}`} />;
          const value = toDateValue(view.year, view.month, day);
          const isAvailable = available.has(value) && value >= todayValue;
          const isSelected = value === selected;
          return (
            <button
              key={value}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(value)}
              aria-pressed={isSelected}
              className={`aspect-square rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-primary-100 text-white"
                  : isAvailable
                    ? "text-primary-100 hover:bg-primary-10 cursor-pointer"
                    : "text-gray-2 cursor-not-allowed"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
