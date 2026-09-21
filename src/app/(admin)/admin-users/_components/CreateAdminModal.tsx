"use client";
import { useState } from "react";
import { Loader2, X } from "lucide-react";

const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-2.5 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

export interface CreateAdminValues {
  fullName: string;
  email: string;
  phone: string;
  temporaryPassword: string;
}

const EMPTY_VALUES: CreateAdminValues = {
  fullName: "",
  email: "",
  phone: "",
  temporaryPassword: "",
};

export default function CreateAdminModal({
  saving,
  fieldErrors,
  onClose,
  onSubmit,
}: {
  saving: boolean;
  fieldErrors?: Record<string, string[]>;
  onClose: () => void;
  onSubmit: (values: CreateAdminValues) => void;
}) {
  const [values, setValues] = useState<CreateAdminValues>(EMPTY_VALUES);

  const set = (key: keyof CreateAdminValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const canSubmit =
    values.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) &&
    values.phone.trim().length >= 7;

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
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-subtle-text hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-black-others">Create Admin</h2>
        <p className="mt-1 text-sm text-subtle-text">
          They&apos;ll get a welcome email with a temporary password and must change it on
          first login.
        </p>

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-[#080A0D]">Full Name</label>
            <input
              className={fieldClass}
              placeholder="e.g., Jane Doe"
              value={values.fullName}
              onChange={set("fullName")}
            />
            {fieldErrors?.fullName && (
              <p className="text-xs text-[#E5102E]">{fieldErrors.fullName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#080A0D]">Email</label>
            <input
              type="email"
              className={fieldClass}
              placeholder="jane@nativemed.com"
              value={values.email}
              onChange={set("email")}
            />
            {fieldErrors?.email && (
              <p className="text-xs text-[#E5102E]">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#080A0D]">Phone</label>
            <input
              className={fieldClass}
              placeholder="+447312537606"
              value={values.phone}
              onChange={set("phone")}
            />
            {fieldErrors?.phone && (
              <p className="text-xs text-[#E5102E]">{fieldErrors.phone[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#080A0D]">
              Temporary Password <span className="text-subtle-text">(optional)</span>
            </label>
            <input
              className={fieldClass}
              placeholder="Leave blank to auto-generate"
              value={values.temporaryPassword}
              onChange={set("temporaryPassword")}
            />
            {fieldErrors?.temporaryPassword && (
              <p className="text-xs text-[#E5102E]">{fieldErrors.temporaryPassword[0]}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-1 px-5 py-2.5 text-sm font-semibold text-black-others hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(values)}
            disabled={saving || !canSubmit}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-primary-100 text-white cursor-pointer disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Create Admin
          </button>
        </div>
      </div>
    </div>
  );
}
