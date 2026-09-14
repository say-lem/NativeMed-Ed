"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import {
  bookingProductSchema,
  emptyBookingProductValues,
  type BookingProductValues,
} from "@/lib/schemas/booking";
import type { AdminBookingProduct } from "@/types/api";
import { addBookingProductAction, updateBookingProductAction } from "../actions";

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

export default function BookingProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product?: AdminBookingProduct;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [newTime, setNewTime] = useState("");
  const [times, setTimes] = useState<string[]>(product ? [...product.availableTimes] : []);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<BookingProductValues>({
    resolver: zodResolver(bookingProductSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          price: String(product.price),
          availableTimes: [...product.availableTimes],
        }
      : emptyBookingProductValues,
  });

  const addTime = () => {
    if (!newTime) return;
    if (!times.includes(newTime)) {
      const next = [...times, newTime].sort();
      setTimes(next);
      setValue("availableTimes", next, { shouldDirty: true });
    }
    setNewTime("");
  };

  const removeTime = (t: string) => {
    const next = times.filter((x) => x !== t);
    setTimes(next);
    setValue("availableTimes", next, { shouldDirty: true });
  };

  const onSubmit = (values: BookingProductValues) => {
    startTransition(async () => {
      const res = product
        ? await updateBookingProductAction(product._id, values)
        : await addBookingProductAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        onSaved();
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't save the session product.");
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
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-subtle-text hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-black-others">
          {product ? "Edit Session Product" : "Add Session Product"}
        </h2>
        <p className="mt-1 text-sm text-subtle-text">
          Price is informational only — booking a slot has no payment gate.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label text="Title" htmlFor="bp-title" />
            <input
              id="bp-title"
              type="text"
              placeholder="1-on-1 Mock Session with Dr Ohaa"
              className={inputClass}
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="space-y-2">
            <Label text="Description" htmlFor="bp-description" />
            <textarea
              id="bp-description"
              rows={4}
              placeholder="What happens in this session?"
              className={`${inputClass} resize-y`}
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div className="space-y-2">
            <Label text="Price (GBP)" htmlFor="bp-price" />
            <input
              id="bp-price"
              type="text"
              inputMode="decimal"
              placeholder="49.99"
              className={inputClass}
              {...register("price")}
            />
            <FieldError message={errors.price?.message} />
          </div>

          <div className="space-y-2">
            <Label text="Available Times" htmlFor="bp-time" />
            <div className="flex items-center gap-2">
              <input
                id="bp-time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={addTime}
                className="shrink-0 grid place-items-center size-10 rounded-[8px] bg-primary-100 text-white cursor-pointer"
                aria-label="Add time"
              >
                <Plus size={16} />
              </button>
            </div>
            {times.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {times.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-10 text-primary-100 text-xs font-medium px-3 py-1.5"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTime(t)}
                      aria-label={`Remove ${t}`}
                      className="cursor-pointer hover:text-primary-100/70"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-subtle-text">
              Time-of-day options offered on every available date (e.g. 10:00, 14:00).
            </p>
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
              {pending ? "Saving..." : product ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
