"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import { formatStatCount } from "@/lib/stats";
import {
  homepageStatsSchema,
  type HomepageStatsValues,
} from "@/lib/schemas/homepage";
import { updateHomepageStatsAction } from "../actions";

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

export default function HomepageStatsForm({
  caseNumber,
  testimonialsCount,
  registrarsCount,
  contactEmail,
  contactPhone,
}: {
  caseNumber: number;
  testimonialsCount: number;
  registrarsCount: number;
  contactEmail: string | null;
  contactPhone: string | null;
}) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<HomepageStatsValues>({
    resolver: zodResolver(homepageStatsSchema),
    defaultValues: {
      testimonialsCount: String(testimonialsCount),
      registrarsCount: String(registrarsCount),
      contactEmail: contactEmail ?? "",
      contactPhone: contactPhone ?? "",
    },
  });

  const onSubmit = (values: HomepageStatsValues) => {
    startTransition(async () => {
      const res = await updateHomepageStatsAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Stats updated");
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't update the stats.");
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-black-others">Home page stats</h2>
      <p className="mt-1 text-sm text-subtle-text">
        These power the &quot;{formatStatCount(caseNumber)} SCA Cases&quot;, testimonies, and GP
        registrars counters on the home page.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="space-y-2">
          <Label text="SCA Cases (live)" htmlFor="caseNumber" />
          <input
            id="caseNumber"
            type="text"
            disabled
            value={formatStatCount(caseNumber)}
            className={`${inputClass} bg-gray-100 text-subtle-text cursor-not-allowed`}
          />
          <p className="text-xs text-subtle-text">
            Always the live count of published cases — not editable here.
          </p>
        </div>

        <div className="space-y-2">
          <Label text="Testimonies" htmlFor="testimonialsCount" />
          <input
            id="testimonialsCount"
            type="text"
            inputMode="numeric"
            className={inputClass}
            {...register("testimonialsCount")}
          />
          <FieldError message={errors.testimonialsCount?.message} />
        </div>

        <div className="space-y-2">
          <Label text="GP Registrars" htmlFor="registrarsCount" />
          <input
            id="registrarsCount"
            type="text"
            inputMode="numeric"
            className={inputClass}
            {...register("registrarsCount")}
          />
          <FieldError message={errors.registrarsCount?.message} />
        </div>

        <div className="space-y-2">
          <Label text="Contact Email (optional)" htmlFor="contactEmail" />
          <input
            id="contactEmail"
            type="email"
            placeholder="info@nativemed.co.uk"
            className={inputClass}
            {...register("contactEmail")}
          />
          <p className="text-xs text-subtle-text">Shown on the public Contact page.</p>
          <FieldError message={errors.contactEmail?.message} />
        </div>

        <div className="space-y-2">
          <Label text="Contact Phone (optional)" htmlFor="contactPhone" />
          <input
            id="contactPhone"
            type="tel"
            placeholder="+447312537606"
            className={inputClass}
            {...register("contactPhone")}
          />
          <p className="text-xs text-subtle-text">Shown on the public Contact page.</p>
          <FieldError message={errors.contactPhone?.message} />
        </div>

        <div className="sm:col-span-3 text-right">
          <Button
            type="submit"
            disabled={pending}
            className="bg-black-others font-bold disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? "Saving..." : "Save Stats"}
          </Button>
        </div>
      </form>
    </div>
  );
}
