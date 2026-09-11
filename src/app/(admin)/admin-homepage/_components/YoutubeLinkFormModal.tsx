"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import {
  youtubeLinkSchema,
  emptyYoutubeLinkValues,
  type YoutubeLinkValues,
} from "@/lib/schemas/homepage";
import type { YoutubeLink } from "@/types/api";
import { addYoutubeLinkAction, updateYoutubeLinkAction } from "../actions";

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

export default function YoutubeLinkFormModal({
  link,
  onClose,
  onSaved,
}: {
  link?: YoutubeLink;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<YoutubeLinkValues>({
    resolver: zodResolver(youtubeLinkSchema),
    defaultValues: link
      ? { title: link.title, url: link.url, order: String(link.order) }
      : emptyYoutubeLinkValues,
  });

  const onSubmit = (values: YoutubeLinkValues) => {
    startTransition(async () => {
      const res = link
        ? await updateYoutubeLinkAction(link._id, values)
        : await addYoutubeLinkAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        onSaved();
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't save the video.");
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
          {link ? "Edit Video" : "Add Video"}
        </h2>
        <p className="mt-1 text-sm text-subtle-text">
          Shown in the &quot;Watch &amp; Learn&quot; section on the home page.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label text="Title" htmlFor="video-title" />
            <input
              id="video-title"
              type="text"
              placeholder="Native SCA Mock Session — Full Walkthrough"
              className={inputClass}
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="space-y-2">
            <Label text="YouTube URL" htmlFor="video-url" />
            <input
              id="video-url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass}
              {...register("url")}
            />
            <FieldError message={errors.url?.message} />
          </div>

          <div className="space-y-2">
            <Label text="Order (optional)" htmlFor="video-order" />
            <input
              id="video-order"
              type="text"
              inputMode="numeric"
              placeholder="0"
              className={inputClass}
              {...register("order")}
            />
            <p className="text-xs text-subtle-text">
              Lower numbers appear first. Leave blank to default to 0.
            </p>
            <FieldError message={errors.order?.message} />
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
              {pending ? "Saving..." : link ? "Save Changes" : "Add Video"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
