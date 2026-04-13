"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Props = {
  targetDate: string | Date;
  eventDateLabel?: string;
  eventTitle?: string;
  ctaLabel?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, "0");

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ClassCountdown({
  targetDate,
  eventDateLabel = "23rd March 2027",
  eventTitle = "Live Class Starts In:",
  ctaLabel = "Register Now",
}: Props) {
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate);

  // ✅ FIX: start with null (prevents SSR mismatch)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(target));

    update(); // run immediately on mount
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  // ✅ FIX: avoid hydration mismatch
  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center py-10 md:py-20"
      style={{ background: "#07070f" }}
    >
      {[
        { size: "100%", bg: "rgba(214, 214, 214, 1)" }, // ✅ fixed extra ")"
        { size: "85%", bg: "rgba(155, 124, 209, 0.08)" },
        { size: "75%", bg: "rgba(8, 10, 13, 1)" },
        { size: "65%", bg: "black" },
      ].map((ring, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: ring.size,
            aspectRatio: "1/1",
            borderRadius: "50%",
            background: ring.bg,
            border: "1px solid rgba(120, 90, 210, 0.08)",
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-6 gap-6 md:gap-9">
        <div>
          <p className="text-Subtle-text leading-[150%] tracking-[-1%] font-normal">
            {eventDateLabel}
          </p>

          <h2 className="font-light leading-[130%] tracking-[-2%] text-2xl md:text-4xl text-white">
            {eventTitle}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2.5 flex-wrap">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-start ">
              <div className="flex flex-col items-center min-w-12 sm:min-w-18 md:min-w-24">
                <span className="text-3xl sm:text-5xl md:text-8xl font-light tabular-nums leading-none tracking-[-2%] text-white">
                  {pad(unit.value)}
                </span>
                <span className="text-xs sm:text-sm md:text-xl leading-[120%] text-gray1 tracking-[-2%] font-light">
                  {unit.label}
                </span>
              </div>

              {i < units.length - 1 && (
                <span className="text-3xl sm:text-5xl md:text-8xl font-light text-gray2 leading-none px-1 sm:px-2 md:px-4">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={() => alert("Register clicked")}
          className="text-sm font-semibold text-white hover:opacity-90 active:scale-95 bg-primary100 transition-all leading-[150%]"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

export default function CountDownToClass() {
  return (
    <ClassCountdown
      targetDate="2027-03-23T00:00:00"
      eventDateLabel="23rd March 2028"
      eventTitle="Live Class Starts In:"
      ctaLabel="Register Now"
    />
  );
}
