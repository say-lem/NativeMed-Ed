"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import { formatDate } from "@/lib/date";
import { examSittingOptions } from "@/lib/schemas/auth";
import {
  slotAvailabilityRequestSchema,
  type SlotAvailabilityRequestValues,
} from "@/lib/schemas/booking";
import type { User } from "@/types/api";
import { requestSlotAvailabilityAction } from "../actions";

const inputClass =
  "border-[0.5px] rounded-[8px] px-4 py-2.5 border-gray-1 w-full outline-none focus:border-primary-100 text-black-others";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-error-other text-xs mt-1 leading-[150%]">{message}</p>;
}

export default function RequestSlotForm({
  productId,
  user,
}: {
  productId: string;
  user: User | null;
}) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [dates, setDates] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<SlotAvailabilityRequestValues>({
    resolver: zodResolver(slotAvailabilityRequestSchema),
    defaultValues: {
      name: user?.fullName ?? "",
      email: user?.email ?? "",
      examSitting: user?.examSitting ?? "",
      preferredDates: [],
    },
  });

  const addDate = () => {
    if (!newDate || dates.includes(newDate)) {
      setNewDate("");
      return;
    }
    const next = [...dates, newDate].sort();
    setDates(next);
    setValue("preferredDates", next, { shouldDirty: true, shouldValidate: true });
    setNewDate("");
  };

  const removeDate = (d: string) => {
    const next = dates.filter((x) => x !== d);
    setDates(next);
    setValue("preferredDates", next, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = (values: SlotAvailabilityRequestValues) => {
    startTransition(async () => {
      const res = await requestSlotAvailabilityAction(productId, values);
      if (res.ok) {
        setSent(true);
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't send your request.");
    });
  };

  if (sent) {
    return (
      <div className="flex items-start gap-3 rounded-[12px] border border-green-200 bg-green-50 p-4">
        <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">
          Your request has been received — we&apos;ll reach out when a slot opens up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-subtle-text">
        No dates are currently available for this session. Leave your details and
        preferred date(s) and we&apos;ll reach out as soon as a slot opens up.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-secondary-100 block">Name</label>
            <input type="text" className={inputClass} {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-secondary-100 block">Email</label>
            <input type="email" className={inputClass} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-secondary-100 block">Exam Sitting</label>
          <select defaultValue={user?.examSitting ?? ""} className={`${inputClass} cursor-pointer`} {...register("examSitting")}>
            <option value="" disabled>
              Select month and year
            </option>
            {examSittingOptions().map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.examSitting?.message} />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-secondary-100 block">Preferred Date(s)</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={addDate}
              className="shrink-0 grid place-items-center size-10 rounded-[8px] bg-primary-100 text-white cursor-pointer"
              aria-label="Add date"
            >
              <Plus size={16} />
            </button>
          </div>
          {dates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {dates.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-10 text-primary-100 text-xs font-medium px-3 py-1.5"
                >
                  {formatDate(d)}
                  <button
                    type="button"
                    onClick={() => removeDate(d)}
                    aria-label={`Remove ${d}`}
                    className="cursor-pointer hover:text-primary-100/70"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <FieldError message={errors.preferredDates?.message} />
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto font-bold text-sm sm:text-base bg-black-others disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Sending..." : "Request Availability"}
        </Button>
      </form>
    </div>
  );
}
