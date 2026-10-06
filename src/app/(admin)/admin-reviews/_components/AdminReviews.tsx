"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Star } from "lucide-react";
import { toast } from "sonner";
import type { AdminReview, ReviewStatus } from "@/types/api";
import { formatDatePassed } from "@/lib/reviews";
import { useAdminList } from "../../_components/AdminListContext";
import Pagination from "../../_components/Pagination";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import EditReviewModal from "./EditReviewModal";
import {
  approveReviewAction,
  revokeReviewAction,
  deleteReviewAction,
} from "../actions";

const TABS = ["All", "Pending", "Approved", "Revoked"] as const;
type Tab = (typeof TABS)[number];
const PAGE_SIZE = 8;

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  revoked: "Revoked",
};

const STATUS_STYLE: Record<ReviewStatus, string> = {
  pending: "bg-[#FFF3D6] text-[#B54708]",
  approved: "bg-[#E5FFEA] text-[#027A48]",
  revoked: "bg-[#FFE6E6] text-[#C11616]",
};

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-[2px] rounded-[33px] text-[13px] font-semibold ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={
            n <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-transparent text-gray-1"
          }
        />
      ))}
    </div>
  );
}

const colGrid = "grid grid-cols-[1.2fr_2fr_0.9fr_0.9fr_240px] items-center gap-6";

export default function AdminReviews({ reviews }: { reviews: AdminReview[] }) {
  const [tab, setTab] = useState<Tab>("Pending");
  const { query, page, setPage } = useAdminList();
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [, startAction] = useTransition();

  const run = (
    id: string,
    action: (id: string) => Promise<{ ok: boolean; message?: string }>,
  ) => {
    setBusyId(id);
    startAction(async () => {
      const res = await action(id);
      if (res.ok) toast.success(res.message ?? "Done");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const approve = (r: AdminReview) => run(r._id, approveReviewAction);
  const revoke = (r: AdminReview) => run(r._id, revokeReviewAction);

  const remove = async (r: AdminReview) => {
    const ok = await confirm({
      title: "Delete review?",
      message: `${r.name}'s review will be permanently deleted.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    run(r._id, deleteReviewAction);
  };

  const q = query.trim().toLowerCase();
  const filtered = reviews.filter((r) => {
    const byTab = tab === "All" ? true : r.status === tab.toLowerCase();
    if (!byTab) return false;
    if (!q) return true;
    return [r.name, r.examSat, r.review].some((f) =>
      f?.toLowerCase().includes(q),
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectTab = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  const countFor = (t: Tab) =>
    t === "All" ? reviews.length : reviews.filter((r) => r.status === t.toLowerCase()).length;

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10">
      <div className="flex flex-wrap items-center border-b border-[#EDEDED]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => selectTab(t)}
            className={`p-4 text-base font-semibold cursor-pointer border-b-[2.5px] -mb-px ${
              tab === t
                ? "text-[#7A51C2] border-[#7A51C2]"
                : "text-subtle-text border-transparent"
            }`}
          >
            {t} ({countFor(t)})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto mt-6">
        <div className="min-w-[900px] rounded-[8px] border border-[#EDEDED] overflow-hidden">
          <div
            className={`${colGrid} bg-primary-10 border-b-[0.5px] border-[#B7B7B9] px-4 sm:px-6 py-3`}
          >
            <span className="text-base text-[#080A0D]">Reviewer</span>
            <span className="text-base text-[#080A0D]">Review</span>
            <span className="text-base text-[#080A0D]">Rating</span>
            <span className="text-base text-[#080A0D]">Status</span>
            <span className="text-base text-[#080A0D]">Action</span>
          </div>

          {rows.length === 0 ? (
            <p className="text-center text-subtle-text py-10">
              {q ? "No reviews match your search." : "No reviews here."}
            </p>
          ) : (
            rows.map((r) => {
              const busy = busyId === r._id;
              return (
                <div
                  key={r._id}
                  className={`${colGrid} border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-4`}
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#080A0D] truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-subtle-text truncate">
                      {r.examSat} · {formatDatePassed(r.datePassed)}
                    </p>
                  </div>
                  <p className="text-sm text-black line-clamp-2">{r.review}</p>
                  <Stars rating={r.rating} />
                  <div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => setEditing(r)}
                        disabled={busy}
                        className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                    )}
                    {r.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => approve(r)}
                        disabled={busy}
                        className="flex items-center justify-center gap-1.5 rounded-[8px] border border-primary-100 text-primary-100 hover:bg-primary-10 text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {busy && <Loader2 size={14} className="animate-spin" />}
                        Approve
                      </button>
                    )}
                    {r.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => revoke(r)}
                        disabled={busy}
                        className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {busy && <Loader2 size={14} className="animate-spin" />}
                        Revoke
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Pagination totalPages={totalPages} />

      {editing && (
        <EditReviewModal
          review={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </section>
  );
}
