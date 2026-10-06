"use client";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { User } from "@/types/api";
import SearchableSelect from "@/components/shared/SearchableSelect";

export type CaseBankAccessMode = "grant" | "revoke" | "restore";

const COPY: Record<CaseBankAccessMode, { title: string; description: string; cta: string }> = {
  grant: {
    title: "Grant Case Bank Access",
    description: "Manually unlock all cases for a user — no payment needed.",
    cta: "Grant Access",
  },
  revoke: {
    title: "Revoke Case Bank Access",
    description: "Cancels their subscription (on Stripe too) immediately.",
    cta: "Revoke Access",
  },
  restore: {
    title: "Restore Case Bank Access",
    description: "Grants a fresh period after a previous revoke.",
    cta: "Restore Access",
  },
};

const DEFAULT_DURATION_DAYS = 30;

export default function CaseBankAccessModal({
  mode,
  users,
  saving,
  onClose,
  onSubmit,
}: {
  mode: CaseBankAccessMode;
  users: User[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (userId: string, durationDays: number) => void;
}) {
  const [userId, setUserId] = useState("");
  const [durationDays, setDurationDays] = useState(String(DEFAULT_DURATION_DAYS));
  const needsDuration = mode !== "revoke";
  const { title, description, cta } = COPY[mode];

  const days = Number(durationDays);
  const validDays = Number.isInteger(days) && days >= 1 && days <= 3650;
  const canSubmit = Boolean(userId) && (!needsDuration || validDays);

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

        <h2 className="text-lg font-semibold text-black-others">{title}</h2>
        <p className="mt-1 text-sm text-subtle-text">{description}</p>

        <div className="mt-5 space-y-2">
          <label className="block text-sm text-[#080A0D]">User</label>
          <SearchableSelect
            value={userId}
            onChange={setUserId}
            placeholder="Select a user"
            options={users.map((u) => ({
              value: u._id,
              label: u.fullName,
              sublabel: u.email,
            }))}
          />
        </div>

        {needsDuration && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm text-[#080A0D]">Duration (days)</label>
            <input
              type="number"
              min={1}
              max={3650}
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-2.5 text-sm text-black-others outline-none focus:border-primary-100"
            />
            {!validDays && (
              <p className="text-xs text-[#E5102E]">Enter a whole number between 1 and 3650.</p>
            )}
          </div>
        )}

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
            onClick={() => onSubmit(userId, days)}
            disabled={saving || !canSubmit}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white cursor-pointer disabled:opacity-60 ${
              mode === "revoke" ? "bg-[#C11616]" : "bg-primary-100"
            }`}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
