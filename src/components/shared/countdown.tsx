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

export default function ClassCountdown({
  targetDate,
  eventDateLabel = "23rd March 2027",
  eventTitle = "Live Class Starts In:",
  ctaLabel = "Register Now",
}: Props) {
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1_000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    /*
     * Full-width dark banner.
     * overflow-hidden clips the rings that bleed outside the banner bounds.
     * relative lets us position the rings behind the content.
     */
    <div
      className="relative w-full overflow-hidden flex items-center justify-center py-20"
      style={{ background: "#07070f" }}
    >
      {/*
       * Concentric rings — rendered largest to smallest so each one
       * paints on top of the previous. This creates the gradient effect:
       * lightest/widest at the edges, darkest closest to the content.
       */}
      {[
        { size: "100%", bg: "rgba(214, 214, 214, 1))" }, // outermost - lightest dark gray
        { size: "85%", bg: "red" }, // second - dark gray with purple tint
        { size: "75%", bg: "green" }, // third - darker purple-gray
        { size: "65%", bg: "black" }, // innermost - darkest purple
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

      {/* Content — z-10 keeps it above all the rings */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-9">
        {/* Small date label above the title */}
        <div>
          <p className="text-Subtle-text leading-[150%] tracking-[-1%] font-normal">
            {eventDateLabel}
          </p>

          {/* Main event title */}
          <h2 className="font-light leading-[130%] tracking-[-2%] text-4xl text-white">
            {eventTitle}
          </h2>
        </div>

        {/* Timer — numbers separated by colons */}
        <div className="flex items-center justify-center gap-2.5">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-start ">
              {/* Single time unit: number + label */}
              <div className="flex flex-col items-center min-w-18 sm:min-w-24">
                <span className=" sm:text-7xl font-light tabular-nums  text-8xl leading- none tracking-[-2%] text-white">
                  {pad(unit.value)}
                </span>
                <span className="text-xl leading-[120%] text-gray1 tracking-[-2%] font-light ">
                  {unit.label}
                </span>
              </div>

              {/* Colon separator — skip after the last unit */}
              {i < units.length - 1 && (
                <span className="text-8xl sm:text-6xl font-light text-gray2 leading-none px-4">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA button */}
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
