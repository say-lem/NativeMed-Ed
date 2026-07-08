"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronDown, Loader2, Upload } from "lucide-react";
import {
  CATEGORIES,
  courseSchema,
  emptyCourseValues,
  buildCoursePayload,
  type CourseFormValues,
} from "@/lib/schemas/course";
import { LogoLoaderOverlay } from "@/components/shared/LogoLoader";
import { saveCourseAction, uploadCourseThumbnailAction } from "../actions";

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

// Category / Payment Type have no Course field — UI-only (not persisted).
function PlainSelect({
  placeholder,
  options,
}: {
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        defaultValue=""
        className={`${fieldClass} appearance-none pr-10 cursor-pointer text-black-others`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black-others"
      />
    </div>
  );
}

export default function UploadCourseForm({
  courseId,
  initialValues,
  initialThumbnail,
}: {
  courseId?: string;
  initialValues?: CourseFormValues;
  initialThumbnail?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(
    initialThumbnail,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialValues ?? emptyCourseValues,
  });

  const onCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const save = (publish: boolean) =>
    handleSubmit(async (values: CourseFormValues) => {
      const payload = buildCoursePayload(values);
      setSaving(true);
      const result = await saveCourseAction({ id: courseId, payload, publish });
      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong");
        setSaving(false);
        return;
      }
      const id = courseId ?? result.courseId;
      if (coverFile && id) {
        const fd = new FormData();
        fd.append("thumbnail", coverFile);
        const up = await uploadCourseThumbnailAction(id, fd);
        if (!up.ok) toast.warning(up.message ?? "Cover upload failed");
      }
      toast.success(result.message ?? "Saved");
      // Navigate + refresh so the list refetches (Router Cache is per-client;
      // revalidatePath alone won't refetch a cached RSC on push). The overlay
      // is driven by `saving`, not the router, so refresh no longer hangs it —
      // navigation unmounts the form and clears it.
      router.push("/admin-courses");
      router.refresh();
    });

  return (
    <section className="sm:px-6 lg:px-10 mb-10 px-4">
      {saving && (
        <LogoLoaderOverlay
          fixed
          label={courseId ? "Saving changes…" : "Creating course…"}
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

        {/* Title + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label text="Course Title" required />
            <input
              type="text"
              placeholder="Eg. Native MRCGP SCA Extensive Course"
              className={fieldClass}
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div className="space-y-2">
            <Label text="Category" />
            <PlainSelect placeholder="Select Category" options={CATEGORIES} />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label text="Price" required />
          <input
            type="text"
            placeholder="£19.99"
            className={fieldClass}
            {...register("price")}
          />
          <FieldError message={errors.price?.message} />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label text="Description" required />
          <textarea
            rows={4}
            placeholder="Enter short description of course"
            className={`${fieldClass} resize-none`}
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
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
