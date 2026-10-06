"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import RichTextEditor from "@/components/shared/RichTextEditor";
import {
  caseBankOverviewSchema,
  type CaseBankOverviewValues,
} from "@/lib/schemas/caseBankOverview";
import type { CaseBankOverview } from "@/types/api";
import {
  updateCaseBankOverviewAction,
  updateCaseBankOverviewImageAction,
} from "../actions";

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

export default function CaseBankOverviewEditor({
  overview,
}: {
  overview: CaseBankOverview;
}) {
  const [pending, startTransition] = useTransition();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePending, startImageTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<CaseBankOverviewValues>({
    resolver: zodResolver(caseBankOverviewSchema),
    defaultValues: {
      title: overview.title,
      description: overview.description,
      detailedDescription: overview.detailedDescription ?? "",
    },
  });

  // Stores markdown (bold/italic/headings/lists) — rendered back with the shared
  // <Markdown> component on the case bank's own product page.
  const { field: detailedDescriptionField } = useController({
    name: "detailedDescription",
    control,
  });

  const onSubmit = (values: CaseBankOverviewValues) => {
    startTransition(async () => {
      const res = await updateCaseBankOverviewAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Overview updated");
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't update the overview.");
    });
  };

  const replaceImage = () => {
    if (!imageFile) return;
    startImageTransition(async () => {
      const fd = new FormData();
      fd.append("image", imageFile);
      const res = await updateCaseBankOverviewImageAction(fd);
      if (res.ok) {
        toast.success(res.message ?? "Cover image updated");
        setImageFile(null);
      } else {
        toast.error(res.message ?? "Couldn't update the cover image.");
      }
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-black-others">Case Bank overview</h2>
      <p className="mt-1 text-sm text-subtle-text">
        How the Case Bank is presented as a product — title, description, and cover
        image shown on the products page and the free case preview.
      </p>

      <div className="mt-5 space-y-2">
        <Label text="Cover Image" htmlFor="case-bank-cover" />
        <div className="flex flex-wrap items-center gap-3">
          {overview.imageUrl && (
            <div className="relative size-16 rounded-[8px] overflow-hidden shrink-0 border border-[#EDEDED]">
              <Image
                src={overview.imageUrl}
                alt="Case bank cover"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <label className="flex-1 min-w-[180px] flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 cursor-pointer">
            <span className="text-sm text-subtle-text truncate">
              {imageFile ? imageFile.name : "Choose a new cover image"}
            </span>
            <Upload size={16} className="text-primary-100 shrink-0" />
            <input
              id="case-bank-cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="button"
            onClick={replaceImage}
            disabled={imagePending || !imageFile}
            className="rounded-[8px] border border-primary-100 text-primary-100 hover:bg-primary-10 text-xs font-medium px-3 py-2.5 cursor-pointer disabled:opacity-60"
          >
            {imagePending ? <Loader2 size={12} className="animate-spin" /> : "Replace"}
          </button>
        </div>
        <p className="text-xs text-subtle-text">
          Shown on the products page card. Falls back to a generic icon until one is set.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <Label text="Title" htmlFor="case-bank-title" />
          <input
            id="case-bank-title"
            type="text"
            className={inputClass}
            {...register("title")}
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div className="space-y-2">
          <Label text="Description" htmlFor="case-bank-description" />
          <input
            id="case-bank-description"
            type="text"
            className={inputClass}
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label text="Detailed Description" htmlFor="case-bank-detailed-description" />
          <RichTextEditor
            value={detailedDescriptionField.value ?? ""}
            onChange={detailedDescriptionField.onChange}
            placeholder="Enter a longer write-up for the case bank's own product page (optional)"
          />
          <p className="text-xs text-subtle-text">
            Shown on the Case Bank product page only, not on the products list card.
            Leave blank to show just the short description above.
          </p>
          <FieldError message={errors.detailedDescription?.message} />
        </div>

        <div className="sm:col-span-2 text-right">
          <Button
            type="submit"
            disabled={pending}
            className="bg-black-others font-bold disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? "Saving..." : "Save Overview"}
          </Button>
        </div>
      </form>
    </div>
  );
}
