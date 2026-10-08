"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import {
  activitySchema,
  emptyActivityValues,
  type ActivityValues,
} from "@/lib/schemas/activity";
import type { Activity } from "@/types/api";
import { activityProduct, activityProductValue, type ActivityProductOption } from "@/lib/activity-product";
import { createActivityAction, updateActivityAction } from "../actions";

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

/** UTC yyyy-mm-dd, matching the UTC-based date formatting used elsewhere on this page. */
function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function EventFormModal({
  event,
  products,
  onClose,
  onSaved,
}: {
  event?: Activity;
  products: ActivityProductOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const savedProduct = event ? activityProductValue(activityProduct(event)) : "";
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ActivityValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: event
      ? { date: toDateInputValue(event.date), description: event.description, time: event.time ?? "", activityType: event.activityType ?? "", activityStatus: event.activityStatus ?? "", product: savedProduct, isPublished: event.isPublished !== false }
      : emptyActivityValues,
  });

  const onSubmit = (values: ActivityValues) => {
    startTransition(async () => {
      const res = event
        ? await updateActivityAction(event._id, values)
        : await createActivityAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        onSaved();
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't save the event.");
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
      <div className="relative z-10 w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-subtle-text hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-black-others">
          {event ? "Edit Event" : "Post an Event"}
        </h2>
        <p className="mt-1 text-sm text-subtle-text">
          Published events appear publicly. Future events also appear on the homepage. Date and description are required; all other fields are optional.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label text="Date" htmlFor="event-date" />
            <input
              id="event-date"
              type="date"
              className={inputClass}
              {...register("date")}
            />
            <FieldError message={errors.date?.message} />
          </div>

          <div className="space-y-2">
            <Label text="Description" htmlFor="event-description" />
            <textarea
              id="event-description"
              rows={4}
              placeholder="Live SCA mock session — join us for..."
              className={`${inputClass} resize-y`}
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>

          {(["activityStatus", "activityType", "time"] as const).map((field) => (
            <div key={field} className="space-y-2">
              <Label text={`${field === "activityStatus" ? "Event title" : field === "activityType" ? "Activity type" : "Time"} (optional)`} htmlFor={`event-${field}`} />
              <input id={`event-${field}`} type={field === "time" ? "time" : "text"} maxLength={field === "time" ? undefined : 100} className={inputClass} {...register(field)} />
              <FieldError message={errors[field]?.message} />
            </div>
          ))}
          {event && <p className="text-xs text-subtle-text">Leaving time, event title, or activity type blank keeps its saved value.</p>}
          <div className="space-y-2">
            <Label text="Linked product (optional)" htmlFor="event-product" />
            <select id="event-product" className={inputClass} {...register("product")}>
              <option value="">No linked product</option>
              {savedProduct && !products.some((product) => product.value === savedProduct) && <option value={savedProduct}>Previously linked product (unavailable)</option>}
              {products.map((product) => <option key={product.value} value={product.value}>{product.title}{!product.isPublished ? " (draft)" : ""}</option>)}
            </select>
            <p className="text-xs text-subtle-text">Draft products must be published before users can view their information. Select “No linked product” to remove a link.</p>
            <FieldError message={errors.product?.message} />
          </div>
          <label className="flex items-center gap-2 text-sm text-secondary-100">
            <input type="checkbox" {...register("isPublished")} /> Publish event (optional; enabled by default)
          </label>

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
              {pending ? "Saving..." : event ? "Save Changes" : "Post Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
