"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  passwordSchema,
  profileSchema,
  type PasswordValues,
  type ProfileValues,
} from "@/lib/schemas/settings";
import { examSittingOptions } from "@/lib/schemas/auth";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import type { FormActionResult } from "@/types/api";

/** Server actions injected by the page so this form works for both admin and members. */
export interface SettingsActions {
  updateProfileAction: (payload: ProfileValues) => Promise<FormActionResult>;
  changePasswordAction: (payload: PasswordValues) => Promise<FormActionResult>;
  logoutAllAction: () => Promise<void>;
}

const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

function Label({ text }: { text: string }) {
  return (
    <label className="block text-sm font-normal leading-[120%] tracking-[-0.01em] text-[#080A0D]">
      {text}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-[#E5102E] mt-1 leading-[150%]">{message}</p>;
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 sm:p-6 border-[0.5px] border-[#B7B7B9] rounded-[12px]">
      <h2 className="text-lg font-semibold leading-[130%] tracking-[-0.02em] text-black-others">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-subtle-text">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function PasswordInput({
  registration,
  autoComplete,
}: {
  registration: UseFormRegisterReturn;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        className={`${fieldClass} pr-11`}
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

const btnPrimary =
  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-primary-100 text-white cursor-pointer disabled:opacity-60";

export default function SettingsForm({
  initialProfile,
  email,
  actions,
}: {
  initialProfile: ProfileValues;
  email: string;
  actions: SettingsActions;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [savingProfile, startProfile] = useTransition();
  const [savingPassword, startPassword] = useTransition();
  const [loggingOut, startLogout] = useTransition();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: initialProfile,
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSaveProfile = async (values: ProfileValues) => {
    const ok = await confirm({
      title: "Save these changes?",
      message:
        "Your profile details will be updated. You can change them again at any time.",
      confirmText: "Save changes",
    });
    if (!ok) return;
    startProfile(async () => {
      const res = await actions.updateProfileAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Profile updated");
        router.refresh(); // reflect the new name in the shell header
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const onChangePassword = async (values: PasswordValues) => {
    const ok = await confirm({
      title: "Change your password?",
      message:
        "You'll stay signed in on this device. Use \"Log out of all devices\" below if you also want to end your other sessions.",
      confirmText: "Update password",
    });
    if (!ok) return;
    startPassword(async () => {
      const res = await actions.changePasswordAction(values);
      if (res.ok) {
        toast.success(res.message ?? "Password changed");
        passwordForm.reset();
      } else {
        if (res.fieldErrors) {
          for (const [field, messages] of Object.entries(res.fieldErrors)) {
            if (messages?.[0]) {
              passwordForm.setError(field as keyof PasswordValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const onLogoutAll = async () => {
    const ok = await confirm({
      title: "Log out of all devices?",
      message:
        "You'll be signed out everywhere, including this session, and returned to the login page.",
      confirmText: "Log out everywhere",
      tone: "danger",
    });
    if (!ok) return;
    startLogout(async () => {
      await actions.logoutAllAction();
    });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-12 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Profile */}
      <Card title="Profile" description="Update your account details.">
        <form
          onSubmit={profileForm.handleSubmit(onSaveProfile)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="space-y-2">
            <Label text="Full Name" />
            <input
              type="text"
              className={fieldClass}
              placeholder="Your name"
              {...profileForm.register("fullName")}
            />
            <FieldError message={profileForm.formState.errors.fullName?.message} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label text="Phone" />
              <input
                type="tel"
                className={fieldClass}
                placeholder="+1234567890"
                {...profileForm.register("phone")}
              />
              <FieldError message={profileForm.formState.errors.phone?.message} />
            </div>
            <div className="space-y-2">
              <Label text="Email" />
              <input
                type="email"
                value={email}
                disabled
                className={`${fieldClass} bg-gray-50 text-subtle-text cursor-not-allowed`}
              />
              <p className="text-xs text-subtle-text mt-1">
                Email can&apos;t be changed here.
              </p>
            </div>
            <div className="space-y-2">
              <Label text="Telegram Username" />
              <input
                type="text"
                className={fieldClass}
                placeholder="@yourusername"
                {...profileForm.register("telegramUsername")}
              />
              <FieldError
                message={profileForm.formState.errors.telegramUsername?.message}
              />
            </div>
            <div className="space-y-2">
              <Label text="Exam Sitting" />
              <select
                className={`${fieldClass} cursor-pointer`}
                {...profileForm.register("examSitting")}
              >
                <option value="">Not set</option>
                {examSittingOptions().map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <FieldError
                message={profileForm.formState.errors.examSitting?.message}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={savingProfile} className={btnPrimary}>
              {savingProfile && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </Card>

      {/* Change password */}
      <Card
        title="Change Password"
        description="Use a strong password you don't use elsewhere."
      >
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="space-y-2">
            <Label text="Current Password" />
            <PasswordInput
              autoComplete="current-password"
              registration={passwordForm.register("currentPassword")}
            />
            <FieldError
              message={passwordForm.formState.errors.currentPassword?.message}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label text="New Password" />
              <PasswordInput
                autoComplete="new-password"
                registration={passwordForm.register("newPassword")}
              />
              <FieldError
                message={passwordForm.formState.errors.newPassword?.message}
              />
            </div>
            <div className="space-y-2">
              <Label text="Confirm New Password" />
              <PasswordInput
                autoComplete="new-password"
                registration={passwordForm.register("confirmPassword")}
              />
              <FieldError
                message={passwordForm.formState.errors.confirmPassword?.message}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className={btnPrimary}
            >
              {savingPassword && <Loader2 size={16} className="animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </Card>

      {/* Sessions */}
      <Card
        title="Sessions"
        description="Sign out of all devices where you're currently logged in."
      >
        <button
          type="button"
          onClick={onLogoutAll}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] cursor-pointer disabled:opacity-60"
        >
          {loggingOut && <Loader2 size={16} className="animate-spin" />}
          Log out of all devices
        </button>
      </Card>
    </section>
  );
}
