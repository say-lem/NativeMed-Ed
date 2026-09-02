"use client";
import { Star } from "lucide-react";

export default function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="cursor-pointer p-0.5"
        >
          <Star
            size={26}
            className={
              n <= value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-1"
            }
          />
        </button>
      ))}
    </div>
  );
}
