"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import RichTextEditor from "@/components/shared/RichTextEditor";
import {
  freeProductEditSchema,
  type FreeProductEditValues,
} from "@/lib/schemas/freeProducts";
import type { FreeProduct } from "@/types/api";
import { replaceFreeProductCoverImageAction, updateFreeProductAction } from "../actions";

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

/** Small standalone uploader — its own request/pending state, separate from the main form. */
function CoverImageReplacer({ productId }: { productId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();

  const replace = () => {
    if (!file) {
      toast.error("Choose an image first");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.append("coverImage", file);
      const res = await replaceFreeProductCoverImageAction(productId, fd);
      if (res.ok) {
        toast.success(res.message ?? "Cover image updated");
        setFile(null);
      } else {
        toast.error(res.message ?? "Couldn't update the cover image.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <Label text="Cover Image" htmlFor="pf-cover" />
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex-1 min-w-[180px] flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 cursor-pointer">
          <span className="text-sm text-subtle-text truncate">
            {file ? file.name : "Choose a new cover image"}
          </span>
          <Upload size={16} className="text-primary-100 shrink-0" />
          <input
            id="pf-cover"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          onClick={replace}
          disabled={pending || !file}
          className="rounded-[8px] border border-primary-100 text-primary-100 hover:bg-primary-10 text-xs font-medium px-3 py-2.5 cursor-pointer disabled:opacity-60"
        >
          {pending ? <Loader2 size={12} className="animate-spin" /> : "Replace"}
        </button>
      </div>
      <p className="text-xs text-subtle-text">
        Replaces the image immediately — separate from the title/description below.
      </p>
    </div>
  );
}

export default function FreeProductEditModal({
  product,
  onClose,
  onSaved,
}: {
  product: FreeProduct;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const { type } = product;

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FreeProductEditValues>({
    resolver: zodResolver(freeProductEditSchema),
    defaultValues: {
      title: product.title,
      description: product.description ?? "",
      fileUrl: type === "link" ? (product.fileUrl ?? "") : "",
      content: type === "blog" ? (product.content ?? "") : "",
      order: String(product.order),
    },
  });

  const onSubmit = (values: FreeProductEditValues) => {
    startTransition(async () => {
      const res = await updateFreeProductAction(product._id, values, type);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        onSaved();
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't save the product.");
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

        <h2 className="text-lg font-semibold text-black-others">Edit Product</h2>
        <p className="mt-1 text-sm text-subtle-text">
          {type === "link" && "Update the title, description, link, or order."}
          {type === "pdf" &&
            "Update the title, description, or order. To change the file, delete and re-upload."}
          {type === "blog" && "Update the title, description, content, or order."}
        </p>

        {type === "blog" && (
          <div className="mt-5">
            <CoverImageReplacer productId={product._id} />
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label text="Title" htmlFor="pf-title" />
            <input id="pf-title" type="text" className={inputClass} {...register("title")} />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="space-y-2">
            <Label
              text={type === "blog" ? "Description (optional)" : "Description"}
              htmlFor="pf-description"
            />
            <textarea
              id="pf-description"
              rows={type === "blog" ? 2 : 4}
              className={`${inputClass} resize-y`}
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>

          {type === "link" && (
            <div className="space-y-2">
              <Label text="External URL" htmlFor="pf-url" />
              <input id="pf-url" type="text" className={inputClass} {...register("fileUrl")} />
              <FieldError message={errors.fileUrl?.message} />
            </div>
          )}

          {type === "blog" && (
            <div className="space-y-2">
              <Label text="Content" htmlFor="pf-content" />
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                )}
              />
              <FieldError message={errors.content?.message} />
            </div>
          )}

          <div className="space-y-2">
            <Label text="Order (optional)" htmlFor="pf-order" />
            <input
              id="pf-order"
              type="text"
              inputMode="numeric"
              className={inputClass}
              {...register("order")}
            />
            <p className="text-xs text-subtle-text">Lower numbers appear first.</p>
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
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
