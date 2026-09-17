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
import { formatDate } from "@/lib/date";
import { founderBioSchema, type FounderBioValues } from "@/lib/schemas/homepage";
import type { FounderBioContent } from "@/types/api";
import { updateFounderBioAction, updateFounderImageAction } from "../actions";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

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

export default function FounderBioEditor({ founderBio }: { founderBio: FounderBioContent }) {
  const [pending, startTransition] = useTransition();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePending, startImageTransition] = useTransition();

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FounderBioValues>({
    resolver: zodResolver(founderBioSchema),
    defaultValues: {
      title: founderBio.title ?? "",
      content: founderBio.content,
    },
  });

  // Stores markdown (bold/italic/headings/lists) — rendered back with the shared
  // <Markdown> component on the public About page.
  const { field: contentField } = useController({ name: "content", control });
  // Same markdown editor — the block under the photo (name / qualifications / "FOUNDER"
  // label) is written as separate lines/paragraphs here, styled back on the public page.
  const { field: titleField } = useController({ name: "title", control });

  const onSubmit = (values: FounderBioValues) => {
    startTransition(async () => {
      const res = await updateFounderBioAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Founder's bio updated");
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't update the founder's bio.");
    });
  };

  const replaceImage = () => {
    if (!imageFile) return;
    startImageTransition(async () => {
      const fd = new FormData();
      fd.append("image", imageFile);
      const res = await updateFounderImageAction(fd);
      if (res.ok) {
        toast.success(res.message ?? "Founder's photo updated");
        setImageFile(null);
      } else {
        toast.error(res.message ?? "Couldn't update the founder's photo.");
      }
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black-others">About the Founder</h2>
        <p className="text-xs text-subtle-text">
          {founderBio.updatedAt ? `Last updated ${formatDate(founderBio.updatedAt)}` : "Never published"}
        </p>
      </div>
      <p className="mt-1 text-sm text-subtle-text">
        The photo, name/qualifications block and bio shown on the public About page.
      </p>

      <div className="mt-5 space-y-2">
        <Label text="Photo" htmlFor="founder-photo" />
        <div className="flex flex-wrap items-center gap-3">
          {founderBio.imageUrl && (
            <div className="relative size-16 rounded-[8px] overflow-hidden shrink-0 border border-[#EDEDED]">
              <Image
                src={founderBio.imageUrl}
                alt="Founder"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <label className="flex-1 min-w-[180px] flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 cursor-pointer">
            <span className="text-sm text-subtle-text truncate">
              {imageFile ? imageFile.name : "Choose a new photo"}
            </span>
            <Upload size={16} className="text-primary-100 shrink-0" />
            <input
              id="founder-photo"
              type="file"
              accept={IMAGE_ACCEPT}
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
          Shown on the About page. Falls back to a placeholder until one is set.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label text="Title block (shown under the photo)" htmlFor="founder-title" />
          <RichTextEditor
            value={titleField.value ?? ""}
            onChange={titleField.onChange}
            placeholder={"Dr Clinton Ohaa\n\nMBBS, MRCS, MRCGP, MBA\nwith distinction\n\nFOUNDER"}
          />
          <p className="text-xs text-subtle-text">
            Separate each group with a blank line, e.g. name, then qualifications, then
            &ldquo;FOUNDER&rdquo; — the first group is styled as the name and the last as
            the founder label. Use bold/italic within a group as needed.
          </p>
          <FieldError message={errors.title?.message} />
        </div>

        <div className="space-y-2">
          <Label text="Bio" htmlFor="founder-content" />
          <RichTextEditor
            value={contentField.value ?? ""}
            onChange={contentField.onChange}
            placeholder="Write the founder's bio..."
          />
          <FieldError message={errors.content?.message} />
        </div>

        <div className="text-right">
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
  );
}
