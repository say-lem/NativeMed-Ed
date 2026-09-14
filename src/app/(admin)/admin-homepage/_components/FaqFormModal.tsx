"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import { faqSchema, emptyFaqValues, type FaqValues } from "@/lib/schemas/homepage";
import type { Faq } from "@/types/api";
import { addFaqAction, updateFaqAction } from "../actions";

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

export default function FaqFormModal({
  faq,
  onClose,
  onSaved,
}: {
  faq?: Faq;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FaqValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: faq
      ? { question: faq.question, answer: faq.answer, order: String(faq.order) }
      : emptyFaqValues,
  });

  const onSubmit = (values: FaqValues) => {
    startTransition(async () => {
      const res = faq ? await updateFaqAction(faq._id, values) : await addFaqAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        onSaved();
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't save the FAQ.");
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

        <h2 className="text-lg font-semibold text-black-others">{faq ? "Edit FAQ" : "Add FAQ"}</h2>
        <p className="mt-1 text-sm text-subtle-text">Shown in the FAQs section on the home page.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 flex flex-col gap-4">
          <div className="space-y-2">
            <Label text="Question" htmlFor="faq-question" />
            <textarea
              id="faq-question"
              rows={2}
              placeholder="What is the Native SCA Extensive Course?"
              className={inputClass}
              {...register("question")}
            />
            <FieldError message={errors.question?.message} />
          </div>

          <div className="space-y-2">
            <Label text="Answer" htmlFor="faq-answer" />
            <textarea
              id="faq-answer"
              rows={5}
              placeholder="Write the answer here..."
              className={inputClass}
              {...register("answer")}
            />
            <FieldError message={errors.answer?.message} />
          </div>

          <div className="space-y-2">
            <Label text="Order (optional)" htmlFor="faq-order" />
            <input
              id="faq-order"
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
              {pending ? "Saving..." : faq ? "Save Changes" : "Add FAQ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
