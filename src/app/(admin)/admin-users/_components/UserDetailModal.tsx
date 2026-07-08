"use client";
import { Loader2, X } from "lucide-react";
import type { User } from "@/types/api";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function fmt(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[#F0F0F0] last:border-b-0">
      <span className="text-sm text-subtle-text">{label}</span>
      <span className="text-sm font-medium text-black-others text-right">
        {value}
      </span>
    </div>
  );
}

export default function UserDetailModal({
  user,
  onClose,
  onToggle,
  pending,
}: {
  user: User;
  onClose: () => void;
  onToggle: () => void;
  pending: boolean;
}) {
  const active = user.isActive !== false;

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

        {/* Header */}
        <div className="flex items-center gap-4 pr-6">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary-10 text-primary-100 text-lg font-semibold">
            {initials(user.fullName)}
          </span>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-black-others truncate">
              {user.fullName}
            </p>
            <p className="text-sm text-subtle-text truncate">{user.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-5">
          <DetailRow label="Phone" value={user.phone || "—"} />
          <DetailRow
            label="Role"
            value={<span className="capitalize">{user.role}</span>}
          />
          <DetailRow
            label="Status"
            value={
              <span
                className={`inline-flex items-center px-3 py-[2px] rounded-full text-xs font-semibold ${
                  active
                    ? "bg-[#E5FFEA] text-[#027A48]"
                    : "bg-[#FFE6E6] text-[#C11616]"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            }
          />
          <DetailRow label="Joined" value={fmt(user.createdAt)} />
          <DetailRow label="Last updated" value={fmt(user.updatedAt)} />
          <DetailRow
            label="Must change password"
            value={user.mustChangePassword ? "Yes" : "No"}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-1 px-5 py-2.5 text-sm font-semibold text-black-others hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onToggle}
            disabled={pending}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white cursor-pointer disabled:opacity-60 ${
              active
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary-100 hover:bg-primary-100/90"
            }`}
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            {active ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
