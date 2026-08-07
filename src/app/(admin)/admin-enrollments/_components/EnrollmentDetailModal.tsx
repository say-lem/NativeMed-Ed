"use client";
import { Loader2, X } from "lucide-react";
import { tierLabel } from "@/lib/tiers";

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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[#F0F0F0] last:border-b-0">
      <span className="text-sm text-subtle-text">{label}</span>
      <span className="text-sm font-medium text-black-others text-right">
        {value}
      </span>
    </div>
  );
}

export default function EnrollmentDetailModal({
  user,
  course,
  status,
  source,
  tier,
  createdAt,
  busy,
  onClose,
  onRevoke,
  onRestore,
}: {
  user: { name: string; email?: string };
  course: { title: string };
  status: "active" | "revoked";
  source?: string;
  tier?: string;
  createdAt?: string;
  busy: boolean;
  onClose: () => void;
  onRevoke: () => void;
  onRestore: () => void;
}) {
  const active = status === "active";

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

        <h2 className="text-lg font-semibold text-black-others pr-6">
          Enrollment
        </h2>

        <div className="mt-5">
          <DetailRow label="User" value={user.name} />
          {user.email && <DetailRow label="Email" value={user.email} />}
          <DetailRow label="Course" value={course.title} />
          <DetailRow
            label="Source"
            value={<span className="capitalize">{source ?? "—"}</span>}
          />
          <DetailRow
            label="Tier"
            value={tierLabel(tier)}
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
                {active ? "Active" : "Revoked"}
              </span>
            }
          />
          <DetailRow label="Granted" value={fmt(createdAt)} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-1 px-5 py-2.5 text-sm font-semibold text-black-others hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
          {active ? (
            <button
              type="button"
              onClick={onRevoke}
              disabled={busy}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-60"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              Revoke
            </button>
          ) : (
            <button
              type="button"
              onClick={onRestore}
              disabled={busy}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-primary-100 hover:bg-primary-100/90 cursor-pointer disabled:opacity-60"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
