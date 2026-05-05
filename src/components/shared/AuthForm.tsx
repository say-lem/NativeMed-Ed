"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TitleCase from "./TitleCase";
import SubtleText from "./SubtleText";
import { Button } from "../ui/button";
import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from "@/lib/schemas/auth";
import { loginAction } from "@/app/(auth)/login/actions";
import { registerAction } from "@/app/(auth)/register/actions";
import type { FormActionResult } from "@/types/api";

function Label({ text, htmlFor }: { text: string; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-black-others leading-[120%] tracking-[-1%] block"
    >
      {text}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-error-other text-xs mt-1 leading-[150%]">{message}</p>
  );
}

const inputClass =
  "border-[0.5px] rounded-[8px] px-3 sm:px-4 py-2.5 sm:py-3 border-secondary-20 w-full focus:outline-none focus:border-primary-100";

function applyServerErrors<T extends Record<string, unknown>>(
  result: FormActionResult,
  setError: (name: keyof T & string, error: { type: string; message: string }) => void,
) {
  if (!result.fieldErrors) return;
  for (const [field, messages] of Object.entries(result.fieldErrors)) {
    if (messages && messages[0]) {
      setError(field as keyof T & string, {
        type: "server",
        message: messages[0],
      });
    }
  }
}

function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="mt-4 sm:mt-6 lg:mt-8 px-0 sm:px-4 lg:px-15">
      <div className="authFormBorder rounded-[16px] relative flex flex-col lg:flex-row overflow-hidden">
        <div
          aria-hidden
          className="hidden lg:block absolute inset-y-0 left-0 w-1/2 authFormBg pointer-events-none"
        />
        <div className="hidden lg:block lg:w-1/2 shrink-0" />
        <aside className="w-full lg:w-1/2 flex items-center flex-col gap-8 sm:gap-10 lg:gap-12 justify-center px-4 sm:pr-8 lg:pr-10 py-8 sm:py-10">
          <div>
            <TitleCase text={title} />
            <SubtleText text={subtitle} />
          </div>
          {children}
          {footer}
        </aside>
      </div>
    </section>
  );
}

function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const {
    register: rhfRegister,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await loginAction(values);
      if (!result.ok) {
        applyServerErrors<LoginValues>(result, setError);
        if (result.message) setServerError(result.message);
      }
    });
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to access your courses"
      footer={
        <Link href="/register">
          <span className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
            Don&apos;t have an account?
            <span className="text-primary-100 font-bold"> Sign Up</span>
          </span>
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 sm:space-y-6"
        noValidate
      >
        <LoginFields register={rhfRegister} errors={errors} />
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
            {pending ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}

function LoginFields({
  register,
  errors,
}: {
  register: UseFormRegister<LoginValues>;
  errors: FieldErrors<LoginValues>;
}) {
  return (
    <>
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
      <div className="space-y-2">
        <Label text="Password" htmlFor="password" />
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>
    </>
  );
}

function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const {
    register: rhfRegister,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  const onSubmit = (values: RegisterValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await registerAction(values);
      if (!result.ok) {
        applyServerErrors<RegisterValues>(result, setError);
        if (result.message) setServerError(result.message);
      }
    });
  };

  return (
    <AuthCard
      title="Get Started"
      subtitle="Sign up to start learning"
      footer={
        <Link href="/login">
          <span className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
            Already have an account?{" "}
            <span className="text-primary-100 font-bold">Sign In</span>
          </span>
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 sm:space-y-6"
        noValidate
      >
        <RegisterFields register={rhfRegister} errors={errors} />
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
            {pending ? "Creating Account..." : "Sign Up"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}

function RegisterFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterValues>;
  errors: FieldErrors<RegisterValues>;
}) {
  return (
    <>
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
      <div className="space-y-2">
        <Label text="Phone" htmlFor="phone" />
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1234567890"
          className={inputClass}
          {...register("phone")}
        />
        <FieldError message={errors.phone?.message} />
      </div>
      <div className="space-y-2">
        <Label text="Password" htmlFor="password" />
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>
    </>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  return mode === "register" ? <RegisterForm /> : <LoginForm />;
}
