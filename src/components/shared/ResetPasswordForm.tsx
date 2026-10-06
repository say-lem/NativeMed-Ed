"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AuthCard,
  FieldError,
  Label,
  PasswordField,
  applyServerErrors,
} from "./AuthForm";
import { Button } from "../ui/button";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/schemas/auth";
import { resetPasswordAction } from "@/app/(auth)/reset-password/actions";

export default function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token ?? "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetPasswordValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (!result.ok) {
        applyServerErrors<ResetPasswordValues>(result, setError);
        if (result.message) setServerError(result.message);
        return;
      }
      toast.success(result.message ?? "Password reset successfully.");
      router.push("/login");
    });
  };

  if (!token) {
    return (
      <AuthCard
        title="Reset Password"
        subtitle="This reset link is invalid or missing a token"
        footer={
          <Link href="/forgot-password">
            <span className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
              <span className="text-primary-100 font-bold">
                Request a new reset link
              </span>
            </span>
          </Link>
        }
      >
        <p className="text-black-others text-sm sm:text-base leading-[150%] text-center">
          Open this page using the link from your password reset email.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Choose a new password for your account"
      footer={
        <Link href="/login">
          <span className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
            Remembered your password?
            <span className="text-primary-100 font-bold"> Sign In</span>
          </span>
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 sm:space-y-6"
        noValidate
      >
        <input type="hidden" {...register("token")} />
        <div className="space-y-2">
          <Label text="New Password" htmlFor="newPassword" />
          <PasswordField
            id="newPassword"
            autoComplete="new-password"
            registration={register("newPassword")}
          />
          <FieldError message={errors.newPassword?.message} />
        </div>
        <div className="space-y-2">
          <Label text="Confirm Password" htmlFor="confirmPassword" />
          <PasswordField
            id="confirmPassword"
            autoComplete="new-password"
            registration={register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
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
            {pending ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
