"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import {
  makeLiveCourseSchema,
  emptyLiveCourseValues,
  buildLiveCoursePayload,
  type LiveCourseFormValues,
} from "@/lib/schemas/liveCourse";
import { applyFieldErrors } from "@/lib/form-errors";
import { LogoLoaderOverlay } from "@/components/shared/LogoLoader";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { saveLiveCourseAction, uploadLiveCourseThumbnailAction } from "../actions";

const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-sm font-normal leading-[120%] tracking-[-0.01em] text-[#080A0D]">
      {text}
      {required && <span className="text-[#E5102E]">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-[#E5102E] mt-1 leading-[150%]">{message}</p>;
}

export default function UploadLiveCourseForm({
  courseId,
  initialValues,
  initialThumbnail,
}: {
  courseId?: string;
  initialValues?: LiveCourseFormValues;
  initialThumbnail?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(
    initialThumbnail,
  );

  const isEdit = Boolean(courseId);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<LiveCourseFormValues>({
    resolver: zodResolver(makeLiveCourseSchema(isEdit ? "edit" : "create")),
    defaultValues: initialValues ?? emptyLiveCourseValues,
  });

  const { field: detailedDescriptionField } = useController({
    name: "detailedDescription",
    control,
  });

  const onCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const save = (publish: boolean) =>
    handleSubmit(async (values: LiveCourseFormValues) => {
      const payload = buildLiveCoursePayload(values);
      setSaving(true);
      const result = await saveLiveCourseAction({ id: courseId, payload, publish });
      if (!result.ok) {
        const shown = applyFieldErrors(result.fieldErrors, setError);
        toast.error(
          result.message ??
            (shown ? "Please fix the highlighted fields" : "Something went wrong"),
        );
        setSaving(false);
        return;
      }
      const id = courseId ?? result.courseId;
      if (coverFile && id) {
        const fd = new FormData();
        fd.append("thumbnail", coverFile);
        const up = await uploadLiveCourseThumbnailAction(id, fd);
        if (!up.ok) toast.warning(up.message ?? "Cover upload failed");
      }
      toast.success(result.message ?? "Saved");
      router.push("/admin-live-courses");
      router.refresh();
    });

  return (
    <section className="sm:px-6 lg:px-10 mb-10 px-4">
      {saving && (
        <LogoLoaderOverlay
          fixed
          label={courseId ? "Saving changes…" : "Creating live course…"}
        />
      )}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-14 p-6 border-[#B7B7B9] border-[0.5px] rounded-[12px] flex flex-col gap-6"
      >
        {/* Cover */}
        <div className="space-y-2">
          <Label text="Cover" />
          <label className="relative flex flex-col items-center justify-center gap-2 rounded-[8px] border-[0.5px] border-[#B7B7B9] py-10 min-h-[160px] cursor-pointer text-center overflow-hidden">
            {coverPreview && (
              <span
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverPreview})` }}
              />
            )}
            <span className="relative z-10 size-12 rounded-full bg-primary-10 flex items-center justify-center">
              <Upload className="size-5 text-primary-100" />
            </span>
            <span className="relative z-10 text-sm text-subtle-text bg-white/80 px-2 rounded">
              {coverPreview ? "Change image" : "Upload or drag image"}
            </span>
            <input
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              onChange={onCover}
            />
          </label>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label text="Course Title" required />
          <input
            type="text"
            placeholder="Eg. Native MRCGP SCA Live Intensive"
            className={fieldClass}
            {...register("title")}
          />
          <FieldError message={errors.title?.message} />
        </div>

        {/* Price + Dates */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-black-others mb-2">
            Price &amp; Dates <span className="text-[#E5102E]">*</span>
          </legend>
          <p className="text-xs text-subtle-text mb-4 leading-[150%]">
            A live course is a single one-time payment, not a subscription.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label text="Price (£)" required={!isEdit} />
              <input
                type="text"
                inputMode="decimal"
                placeholder="199.99"
                className={fieldClass}
                {...register("price")}
              />
              <FieldError message={errors.price?.message} />
            </div>
            <div className="space-y-2">
              <Label text="Start Date" required={!isEdit} />
              <input type="date" className={fieldClass} {...register("startDate")} />
              <FieldError message={errors.startDate?.message} />
            </div>
            <div className="space-y-2">
              <Label text="End Date" required={!isEdit} />
              <input type="date" className={fieldClass} {...register("endDate")} />
              <FieldError message={errors.endDate?.message} />
            </div>
          </div>
        </fieldset>

        {/* Google Drive folder */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-black-others mb-2">
            Google Drive folder{" "}
            {!isEdit && <span className="text-[#E5102E]">*</span>}
          </legend>
          <p className="text-xs text-subtle-text mb-3 leading-[150%]">
            Share the folder with the Native Med service account (Editor role)
            before saving. Paste the folder link or its ID.
            {isEdit && " Leave it empty to keep the current folder."}
          </p>
          <div className="space-y-2">
            <Label text="Course materials folder" required={!isEdit} />
            <input
              type="text"
              placeholder="https://drive.google.com/drive/folders/…"
              className={fieldClass}
              {...register("driveFolderId")}
            />
            <FieldError message={errors.driveFolderId?.message} />
          </div>
        </fieldset>

        {/* Community invite links */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-black-others mb-2">
            Community links
          </legend>
          <p className="text-xs text-subtle-text mb-3 leading-[150%]">
            Optional. Shown on the course page and emailed to a buyer when they purchase.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label text="Telegram invite link" />
              <input
                type="text"
                placeholder="https://t.me/…"
                className={fieldClass}
                {...register("telegramChannel")}
              />
              <FieldError message={errors.telegramChannel?.message} />
            </div>
            <div className="space-y-2">
              <Label text="WhatsApp invite link" />
              <input
                type="text"
                placeholder="https://chat.whatsapp.com/…"
                className={fieldClass}
                {...register("whatsappChannel")}
              />
              <FieldError message={errors.whatsappChannel?.message} />
            </div>
          </div>
        </fieldset>

        {/* Description */}
        <div className="space-y-2">
          <Label text="Description" required />
          <textarea
            rows={4}
            placeholder="Enter short description of the live course"
            className={`${fieldClass} resize-none`}
            {...register("description")}
          />
          <p className="text-xs text-subtle-text">
            Shown on live-course cards and listings — keep it brief.
          </p>
          <FieldError message={errors.description?.message} />
        </div>

        {/* Detailed description */}
        <div className="space-y-2">
          <Label text="Detailed Description" />
          <RichTextEditor
            value={detailedDescriptionField.value ?? ""}
            onChange={detailedDescriptionField.onChange}
            placeholder="Enter a longer write-up for the course detail page (optional)"
          />
          <p className="text-xs text-subtle-text">
            Shown on the course detail page only, not on cards. Leave blank to show just the
            short description above.
          </p>
          <FieldError message={errors.detailedDescription?.message} />
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={save(false)}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-primary-100 text-primary-100 cursor-pointer disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={save(true)}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-primary-100 text-white cursor-pointer disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Publish Now
          </button>
        </div>
      </form>
    </section>
  );
}
