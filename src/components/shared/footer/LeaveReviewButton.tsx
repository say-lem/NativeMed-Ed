"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import ReviewFormModal from "./ReviewFormModal";

const VARIANT_CLASS = {
  /** For the dark footer background. */
  footer: "border border-white/30 text-white hover:bg-white/10",
  /** For light backgrounds, e.g. the /reviews page. */
  solid: "bg-primary-100 text-white hover:bg-primary-100/90",
};

export default function LeaveReviewButton({
  variant = "footer",
}: {
  variant?: keyof typeof VARIANT_CLASS;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 rounded-full text-sm font-semibold px-5 py-2.5 cursor-pointer w-fit ${VARIANT_CLASS[variant]}`}
      >
        <Star size={16} />
        Leave a Review
      </button>
      {open && <ReviewFormModal onClose={() => setOpen(false)} />}
    </>
  );
}
