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
  facebookUrl,
  whatsappUrl,
  twitterUrl,
  instagramUrl,
  youtubeUrl,
}: {
  caseNumber: number;
  testimonialsCount: number;
  registrarsCount: number;
  contactEmail: string | null;
  contactPhone: string | null;
  facebookUrl: string | null;
  whatsappUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
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
      facebookUrl: facebookUrl ?? "",
      whatsappUrl: whatsappUrl ?? "",
      twitterUrl: twitterUrl ?? "",
      instagramUrl: instagramUrl ?? "",
      youtubeUrl: youtubeUrl ?? "",
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

        <fieldset className="sm:col-span-3 space-y-4 pt-2">
          <legend className="text-sm font-semibold text-black-others mb-1">
            Social links (optional)
          </legend>
          <p className="text-xs text-subtle-text -mt-3 mb-3">
            Shown as live icons on the public Contact page — a platform left blank stays a
            &quot;coming soon&quot; button instead of a link.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label text="Facebook URL" htmlFor="facebookUrl" />
              <input
                id="facebookUrl"
                type="text"
                placeholder="https://facebook.com/…"
                className={inputClass}
                {...register("facebookUrl")}
              />
              <FieldError message={errors.facebookUrl?.message} />
            </div>
            <div className="space-y-2">
              <Label text="Instagram URL" htmlFor="instagramUrl" />
              <input
                id="instagramUrl"
                type="text"
                placeholder="https://instagram.com/…"
                className={inputClass}
                {...register("instagramUrl")}
              />
              <FieldError message={errors.instagramUrl?.message} />
            </div>
            <div className="space-y-2">
              <Label text="X (Twitter) URL" htmlFor="twitterUrl" />
              <input
                id="twitterUrl"
                type="text"
                placeholder="https://x.com/…"
                className={inputClass}
                {...register("twitterUrl")}
              />
              <FieldError message={errors.twitterUrl?.message} />
            </div>
            <div className="space-y-2">
              <Label text="YouTube URL" htmlFor="youtubeUrl" />
              <input
                id="youtubeUrl"
                type="text"
                placeholder="https://youtube.com/@…"
                className={inputClass}
                {...register("youtubeUrl")}
              />
              <FieldError message={errors.youtubeUrl?.message} />
            </div>
            <div className="space-y-2">
              <Label text="WhatsApp URL" htmlFor="whatsappUrl" />
              <input
                id="whatsappUrl"
                type="text"
                placeholder="https://wa.me/…"
                className={inputClass}
                {...register("whatsappUrl")}
              />
              <FieldError message={errors.whatsappUrl?.message} />
            </div>
          </div>
        </fieldset>

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
