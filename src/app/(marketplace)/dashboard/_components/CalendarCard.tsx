"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Ymd = { y: number; m: number; d: number };

function buildCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const leading = (firstWeekday + 6) % 7; // shift so Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: leading }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function CalendarCard() {
  const [view, setView] = useState({ year: 2026, month: 0 });
  const [selected, setSelected] = useState<Ymd | null>({ y: 2026, m: 0, d: 2 });

  const cells = buildCells(view.year, view.month);
  const prev = () =>
    setView((v) =>
      v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 },
    );
  const next = () =>
    setView((v) =>
      v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 },
    );

  const isSelected = (day: number) =>
    selected?.y === view.year && selected?.m === view.month && selected?.d === day;

  return (
    <div className="rounded-[14px] border-[0.5px] border-[#E0E0E0] adminCardShadow bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <button type="button" aria-label="Previous month" onClick={prev} className="cursor-pointer text-subtle-text hover:text-black-others">
          <ChevronLeft size={18} />
        </button>
        <p className="text-base font-semibold text-black-others leading-[130%]">
          {MONTHS[view.month]}, {view.year}
        </p>
        <button type="button" aria-label="Next month" onClick={next} className="cursor-pointer text-subtle-text hover:text-black-others">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="text-xs font-medium text-subtle-text">
            {w}
          </span>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day && (
              <button
                type="button"
                onClick={() => setSelected({ y: view.year, m: view.month, d: day })}
                className={`size-7 flex items-center justify-center rounded-full text-xs cursor-pointer ${
                  isSelected(day)
                    ? "bg-primary-100 text-white font-semibold"
                    : "text-black-others hover:bg-primary-10"
                }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
