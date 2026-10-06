"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TitleCase from "./TitleCase";
import SubtleText from "./SubtleText";
import { Button } from "../ui/button";
import {
  examSittingOptions,
  loginSchema,
  registerFormSchema,
  type LoginValues,
  type RegisterFormValues,
  type RegisterValues,
} from "@/lib/schemas/auth";
import { loginAction } from "@/app/(auth)/login/actions";
import { registerAction } from "@/app/(auth)/register/actions";
import type { FormActionResult } from "@/types/api";

export function Label({ text, htmlFor }: { text: string; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-black-others leading-[120%] tracking-[-1%] block"
    >
      {text}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-error-other text-xs mt-1 leading-[150%]">{message}</p>
  );
}

export const inputClass =
  "border-[0.5px] rounded-[8px] px-3 sm:px-4 py-2.5 sm:py-3 border-secondary-20 w-full focus:outline-none focus:border-primary-100";

/** Carry the post-login `redirect` target across the login ↔ register links. */
function withRedirect(href: string, redirectTo?: string): string {
  return redirectTo ? `${href}?redirect=${encodeURIComponent(redirectTo)}` : href;
}

export function PasswordField({
  id,
  autoComplete,
  registration,
}: {
  id: string;
  autoComplete: string;
  registration: UseFormRegisterReturn;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        className={`${inputClass} pr-11`}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-text hover:text-black-others cursor-pointer"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function applyServerErrors<T extends Record<string, unknown>>(
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

export function AuthCard({
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

function LoginForm({ redirectTo }: { redirectTo?: string }) {
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
      const result = await loginAction(values, redirectTo);
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
        <Link href={withRedirect("/register", redirectTo)}>
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
        <div className="flex items-center justify-between gap-2">
          <Label text="Password" htmlFor="password" />
          <Link
            href="/forgot-password"
            className="text-primary-100 text-xs sm:text-sm font-bold shrink-0"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordField
          id="password"
          autoComplete="current-password"
          registration={register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>
    </>
  );
}

function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const {
    register: rhfRegister,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      examSitting: "",
      password: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setServerError(null);
    // agreeToTerms only gates the UI — the backend doesn't expect it in the payload.
    const { fullName, email, examSitting, password } = values;
    startTransition(async () => {
      const result = await registerAction(
        { fullName, email, examSitting, password },
        redirectTo,
      );
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
        <Link href={withRedirect("/login", redirectTo)}>
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
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              id="agreeToTerms"
              className="mt-1 size-4 shrink-0 rounded-[4px] border-[0.5px] border-secondary-20 accent-primary-100 cursor-pointer"
              {...rhfRegister("agreeToTerms")}
            />
            <span className="font-light text-xs sm:text-sm leading-[150%] text-subtle-text">
              I have read and agree to the{" "}
              <Link
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 font-bold"
              >
                Terms &amp; Conditions
              </Link>
              ,{" "}
              <Link
                href="/legal-disclaimer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 font-bold"
              >
                Legal Disclaimer
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 font-bold"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <FieldError message={errors.agreeToTerms?.message} />
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
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
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
        <Label text="Exam Sitting" htmlFor="examSitting" />
        <select
          id="examSitting"
          defaultValue=""
          className={`${inputClass} cursor-pointer`}
          {...register("examSitting")}
        >
          <option value="" disabled>
            Select month and year
          </option>
          {examSittingOptions().map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.examSitting?.message} />
      </div>
      <div className="space-y-2">
        <Label text="Password" htmlFor="password" />
        <PasswordField
          id="password"
          autoComplete="new-password"
          registration={register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>
    </>
  );
}

export default function AuthForm({
  mode,
  redirectTo,
}: {
  mode: "login" | "register";
  redirectTo?: string;
}) {
  return mode === "register" ? (
    <RegisterForm redirectTo={redirectTo} />
  ) : (
    <LoginForm redirectTo={redirectTo} />
  );
}
