"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StarRatingInput from "@/components/shared/StarRatingInput";
import { applyFieldErrors } from "@/lib/form-errors";
import { sanitizeDatePassedInput } from "@/lib/reviews";
import {
  reviewSchema,
  emptyReviewValues,
  type ReviewValues,
} from "@/lib/schemas/review";
import { submitReviewAction } from "./actions";

const inputClass =
  "border-[0.5px] rounded-[8px] px-4 py-2.5 border-secondary-20 w-full outline-none focus:border-primary-100 text-black-others";

function Label({ text, htmlFor }: { text: string; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-secondary-100 text-sm leading-[120%] tracking-[-1%] block"
    >
      {text}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-error-other text-xs mt-1 leading-[150%]">{message}</p>;
}

export default function ReviewFormModal({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: emptyReviewValues,
  });

  const onSubmit = (values: ReviewValues) => {
    startTransition(async () => {
      const res = await submitReviewAction(values);
      if (res.ok) {
        setSent(true);
        toast.success(res.message ?? "Review submitted");
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't submit your review.");
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 cursor-default"
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-subtle-text hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        {sent ? (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <CheckCircle2 className="size-14 text-green-500" />
            <h3 className="text-xl font-semibold text-black-others">
              Thanks for your review
            </h3>
            <p className="text-subtle-text leading-[150%] max-w-sm">
              It&apos;ll appear on the site once an admin approves it.
            </p>
            <Button type="button" onClick={onClose} className="font-bold mt-2">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-black-others">
              Leave a Review
            </h2>
            <p className="mt-1 text-sm text-subtle-text">
              Passed your exam? Tell other candidates how Native helped.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-5 flex flex-col gap-4"
            >
              <div className="space-y-2">
                <Label text="Your Name" htmlFor="name" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Dr. Jane Doe"
                  className={inputClass}
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label text="Exam Sat" htmlFor="examSat" />
                  <input
                    id="examSat"
                    type="text"
                    placeholder="SCA"
                    className={inputClass}
                    {...register("examSat")}
                  />
                  <FieldError message={errors.examSat?.message} />
                </div>

                <div className="space-y-2">
                  <Label text="Date Passed" htmlFor="datePassed" />
                  <input
                    id="datePassed"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    maxLength={5}
                    className={inputClass}
                    {...register("datePassed", {
                      onChange: (e) => {
                        e.target.value = sanitizeDatePassedInput(e.target.value);
                      },
                    })}
                  />
                  <FieldError message={errors.datePassed?.message} />
                </div>
              </div>

              <div className="space-y-2">
                <Label text="Rating" htmlFor="rating" />
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <StarRatingInput value={field.value} onChange={field.onChange} />
                  )}
                />
                <FieldError message={errors.rating?.message} />
              </div>

              <div className="space-y-2">
                <Label text="Your Review" htmlFor="review" />
                <textarea
                  id="review"
                  rows={4}
                  placeholder="Share what helped you most..."
                  className={`${inputClass} resize-y`}
                  {...register("review")}
                />
                <FieldError message={errors.review?.message} />
              </div>

              <div className="text-right mt-2">
                <Button
                  type="submit"
                  disabled={pending}
                  className="bg-black-others font-bold disabled:opacity-60"
                >
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {pending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
