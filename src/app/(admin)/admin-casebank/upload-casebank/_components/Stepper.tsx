"use client";
import { Fragment } from "react";
import { Check } from "lucide-react";

export default function Stepper({
  current,
  steps,
  onSelect,
}: {
  current: number;
  steps: string[];
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center overflow-x-auto">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Fragment key={label}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              className="flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span
                className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  done || active
                    ? "bg-primary-100 text-white"
                    : "border border-gray-2 text-subtle-text bg-white"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span
                className={`text-sm whitespace-nowrap ${
                  active ? "text-black-others font-semibold" : "text-subtle-text"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={`h-[2px] w-8 sm:w-16 lg:w-24 mx-2 shrink-0 ${
                  done ? "bg-primary-100" : "bg-gray-2"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
