"use client";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StarRatingInput from "@/components/shared/StarRatingInput";
import { applyFieldErrors } from "@/lib/form-errors";
import { sanitizeDatePassedInput } from "@/lib/reviews";
import { reviewSchema, type ReviewValues } from "@/lib/schemas/review";
import type { AdminReview } from "@/types/api";
import { updateReviewAction } from "../actions";

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

export default function EditReviewModal({
  review,
  onClose,
  onSaved,
}: {
  review: AdminReview;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: review.name,
      examSat: review.examSat,
      datePassed: review.datePassed,
      rating: review.rating,
      review: review.review,
    },
  });

  const onSubmit = (values: ReviewValues) => {
    startTransition(async () => {
      const res = await updateReviewAction(review._id, values);
      if (res.ok) {
        toast.success(res.message ?? "Review updated");
        onSaved();
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't update the review.");
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

        <h2 className="text-lg font-semibold text-black-others">Edit Review</h2>
        <p className="mt-1 text-sm text-subtle-text">
          Only pending reviews can be edited.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label text="Reviewer Name" htmlFor="edit-name" />
            <input
              id="edit-name"
              type="text"
              className={inputClass}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label text="Exam Sat" htmlFor="edit-examSat" />
              <input
                id="edit-examSat"
                type="text"
                className={inputClass}
                {...register("examSat")}
              />
              <FieldError message={errors.examSat?.message} />
            </div>

            <div className="space-y-2">
              <Label text="Date Passed" htmlFor="edit-datePassed" />
              <input
                id="edit-datePassed"
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
            <Label text="Rating" htmlFor="edit-rating" />
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
            <Label text="Review" htmlFor="edit-review" />
            <textarea
              id="edit-review"
              rows={4}
              className={`${inputClass} resize-y`}
              {...register("review")}
            />
            <FieldError message={errors.review?.message} />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-1 px-5 py-2.5 text-sm font-semibold text-black-others hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-black-others font-bold disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
