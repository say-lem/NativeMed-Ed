import { Star } from "lucide-react";
import { formatDatePassed } from "@/lib/reviews";
import type { Review } from "@/types/api";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-4 py-4 px-4 sm:py-5 sm:px-6 lg:py-6 lg:px-8 rounded-[16px] bg-[rgba(245,239,255,0.7)] border border-[rgba(155,124,209,0.4)]">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] text-black-others">
          {review.examSat} Passed — {formatDatePassed(review.datePassed)}
        </p>
        <div className="flex shrink-0 gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={14}
              className={
                n <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-1"
              }
            />
          ))}
        </div>
      </div>

      <p className="text-xs sm:text-sm lg:text-lg leading-[130%] tracking-[-2%] text-secondary-100">
        <span>&ldquo;</span>
        {review.review}
        <span>&rdquo;</span>
      </p>

      <p className="font-semibold text-xs sm:text-sm lg:text-lg leading-[120%] tracking-[-2%] text-right">
        — {review.name}
      </p>
    </div>
  );
}
