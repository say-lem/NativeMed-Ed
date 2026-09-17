"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import RichTextEditor from "@/components/shared/RichTextEditor";
import {
  bookingProductSchema,
  emptyBookingProductValues,
  type BookingProductValues,
} from "@/lib/schemas/booking";
import type { AdminBookingProduct } from "@/types/api";
import {
  addBookingProductAction,
  updateBookingProductAction,
  uploadBookingProductImageAction,
} from "../actions";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl ?? null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<BookingProductValues>({
    resolver: zodResolver(bookingProductSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          detailedDescription: product.detailedDescription ?? "",
          price: String(product.price),
          availableTimes: [...product.availableTimes],
        }
      : emptyBookingProductValues,
  });

  // Stores markdown (bold/italic/headings/lists) — rendered back with the shared
  // <Markdown> component on the session's own detail page.
  const { field: detailedDescriptionField } = useController({
    name: "detailedDescription",
    control,
  });

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

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
      let id: string | undefined = product?._id;
      let ok: boolean;
      let message: string | undefined;
      let fieldErrors: Record<string, string[]> | undefined;
      if (product) {
        const res = await updateBookingProductAction(product._id, values);
        ({ ok, message, fieldErrors } = res);
      } else {
        const res = await addBookingProductAction(values);
        ({ ok, message, fieldErrors } = res);
        id = res.productId;
      }
      if (!ok) {
        applyFieldErrors(fieldErrors, setError);
        toast.error(message ?? "Couldn't save the session product.");
        return;
      }
      if (imageFile && id) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const up = await uploadBookingProductImageAction(id, fd);
        if (!up.ok) toast.warning(up.message ?? "Cover upload failed");
      }
      toast.success(message ?? "Saved");
      onSaved();
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
            <Label text="Cover Image" htmlFor="bp-image" />
            <div className="flex flex-wrap items-center gap-3">
              {imagePreview && (
                <div className="relative size-16 rounded-[8px] overflow-hidden shrink-0 border border-[#EDEDED]">
                  <Image
                    src={imagePreview}
                    alt="Session cover preview"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <label className="flex-1 min-w-[160px] flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-secondary-20 px-4 py-3 cursor-pointer">
                <span className="text-sm text-subtle-text truncate">
                  {imageFile ? imageFile.name : "Choose a cover image"}
                </span>
                <Upload size={16} className="text-primary-100 shrink-0" />
                <input
                  id="bp-image"
                  type="file"
                  accept={IMAGE_ACCEPT}
                  className="hidden"
                  onChange={onImage}
                />
              </label>
            </div>
            <p className="text-xs text-subtle-text">
              Shown on the session card and its own detail page. Optional.
            </p>
          </div>

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
            <Label text="Detailed Description" htmlFor="bp-detailed-description" />
            <RichTextEditor
              value={detailedDescriptionField.value ?? ""}
              onChange={detailedDescriptionField.onChange}
              placeholder="Longer write-up for the session's own detail page (optional)"
            />
            <p className="text-xs text-subtle-text">
              Shown on the session&apos;s detail page only, not on the browse card. Leave
              blank to show just the short description above.
            </p>
            <FieldError message={errors.detailedDescription?.message} />
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
