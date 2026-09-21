"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthCard,
  FieldError,
  Label,
  applyServerErrors,
  inputClass,
} from "./AuthForm";
import { Button } from "../ui/button";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/schemas/auth";
import { forgotPasswordAction } from "@/app/(auth)/forgot-password/actions";

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await forgotPasswordAction(values);
      if (!result.ok) {
        applyServerErrors<ForgotPasswordValues>(result, setError);
        if (result.message) setServerError(result.message);
        return;
      }
      setSent(
        result.message ??
          "If that email is registered, a password reset link has been sent.",
      );
    });
  };

  return (
    <AuthCard
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link href="/login">
          <span className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
            Remembered your password?
            <span className="text-primary-100 font-bold"> Sign In</span>
          </span>
        </Link>
      }
    >
      {sent ? (
        <p
          className="text-black-others text-sm sm:text-base leading-[150%] text-center"
          role="status"
          aria-live="polite"
        >
          {sent}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4 sm:space-y-6"
          noValidate
        >
          <div className="space-y-2">
            <Label text="Email" htmlFor="email" />
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
          {serverError && (
            <p
              className="text-error-other text-sm leading-[150%]"
              role="alert"
              aria-live="polite"
            >
              {serverError}
            </p>
          )}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-[90%] font-bold disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {pending ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
