"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { applyFieldErrors } from "@/lib/form-errors";
import {
  contactSchema,
  emptyContactValues,
  type ContactValues,
} from "@/lib/schemas/contact";
import { sendContactMessageAction } from "../actions";

const inputClass =
  "border-[0.5px] rounded-[8px] px-4 py-3 border-secondary-20 w-full outline-none focus:border-primary-100";

function Label({ text, htmlFor }: { text: string; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-secondary-100 leading-[120%] tracking-[-1%] block"
    >
      {text}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-error-other text-xs mt-1 leading-[150%]">{message}</p>;
}

export default function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyContactValues,
  });

  const onSubmit = (values: ContactValues) => {
    startTransition(async () => {
      const res = await sendContactMessageAction(values);
      if (res.ok) {
        setSent(true);
        reset();
        toast.success(res.message ?? "Message sent");
        return;
      }
      applyFieldErrors(res.fieldErrors, setError);
      toast.error(res.message ?? "Couldn't send your message.");
    });
  };

  if (sent) {
    return (
      <aside className="w-full md:basis-2/3 rounded-[16px] border border-primary-20 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[320px]">
        <CheckCircle2 className="size-14 text-green-500" />
        <h3 className="text-xl font-semibold text-black-others">
          Thanks — we&apos;ve got your message
        </h3>
        {/* The API returns 202 (accepted, queued), so we promise a reply rather than
            claiming the email has already landed. */}
        <p className="text-subtle-text leading-[150%] max-w-sm">
          We&apos;ll get back to you by email as soon as we can.
        </p>
        <Button
          type="button"
          onClick={() => setSent(false)}
          variant="outline"
          className="font-bold border-black-others text-black-others mt-2"
        >
          Send another message
        </Button>
      </aside>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full md:basis-2/3 rounded-[16px] border border-primary-20 p-4 sm:p-5 md:p-8 space-y-4 sm:space-y-5 md:space-y-7"
    >
      <div className="space-y-2">
        <Label text="Full Name" htmlFor="fullName" />
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          className={inputClass}
          {...register("fullName")}
        />
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="space-y-2">
        <Label text="Email Address" htmlFor="email" />
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="johndoe@gmail.com"
          className={inputClass}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label text="Message" htmlFor="message" />
        {/* Textarea, not an input: the backend needs at least 10 characters and accepts up
            to 5000, and the message is treated as plain text. */}
        <textarea
          id="message"
          rows={5}
          placeholder="How can we help?"
          className={`${inputClass} resize-y`}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <div className="text-right">
        <Button
          type="submit"
          disabled={pending}
          className="bg-black-others font-bold disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
