"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/date";
import type { AdminSlotAvailabilityRequest } from "@/types/api";
import {
  deleteSlotAvailabilityRequestAction,
  resolveSlotAvailabilityRequestAction,
} from "../actions";

type View = "pending" | "resolved";

const rowGrid = "grid grid-cols-[1fr_1.2fr_1fr_100px_90px] items-center gap-6";

export default function SlotAvailabilityRequestsList({
  requests,
}: {
  requests: AdminSlotAvailabilityRequest[];
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [view, setView] = useState<View>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startAction] = useTransition();

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status === "resolved");
  const shown = view === "pending" ? pending : resolved;

  const resolve = (request: AdminSlotAvailabilityRequest) => {
    setBusyId(request._id);
    startAction(async () => {
      const res = await resolveSlotAvailabilityRequestAction(request._id);
      if (res.ok) toast.success(res.message ?? "Marked resolved");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = async (request: AdminSlotAvailabilityRequest) => {
    const ok = await confirm({
      title: "Delete this request?",
      message: `The availability request from "${request.name}" will be permanently removed.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(request._id);
    startAction(async () => {
      const res = await deleteSlotAvailabilityRequestAction(request._id);
      if (res.ok) toast.success(res.message ?? "Request deleted");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-black-others">
          Availability requests ({requests.length})
        </h2>
        <div className="inline-flex rounded-[8px] border border-[#EDEDED] p-1 bg-gray-50">
          {(
            [
              { id: "pending", label: `Pending (${pending.length})` },
              { id: "resolved", label: `Resolved (${resolved.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              className={`px-4 py-1.5 rounded-[6px] text-sm font-semibold cursor-pointer ${
                view === t.id ? "bg-white shadow-sm text-primary-100" : "text-subtle-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="text-center text-subtle-text py-10">
          {view === "pending" ? "No pending requests." : "No resolved requests."}
        </p>
      ) : (
        <div className="overflow-x-auto mt-5">
          <div className="min-w-[760px] flex flex-col">
            <div className={`${rowGrid} bg-primary-10 rounded-[8px] px-4 py-3`}>
              <span className="text-sm font-semibold text-black-others">Requested By</span>
              <span className="text-sm font-semibold text-black-others">Session</span>
              <span className="text-sm font-semibold text-black-others">Preferred Dates</span>
              <span className="text-sm font-semibold text-black-others">Sitting</span>
              <span className="text-sm font-semibold text-black-others">Actions</span>
            </div>
            {shown.map((request) => {
              const busy = busyId === request._id;
              return (
                <div key={request._id} className={`${rowGrid} border-b border-[#EDEDED] px-4 py-4`}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black-others truncate">
                      {request.name}
                    </p>
                    <p className="text-xs text-subtle-text truncate">{request.email}</p>
                  </div>
                  <p className="text-sm text-black-others truncate">
                    {request.productId?.title ?? "Deleted product"}
                  </p>
                  <p className="text-xs text-black-others">
                    {request.preferredDates.map((d) => formatDate(d)).join(", ")}
                  </p>
                  <p className="text-sm text-black-others whitespace-nowrap">
                    {request.examSitting}
                  </p>
                  <div className="flex items-center gap-2">
                    {request.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => resolve(request)}
                        disabled={busy}
                        aria-label="Mark resolved"
                        className="grid place-items-center size-8 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] cursor-pointer disabled:opacity-60"
                      >
                        {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(request)}
                      disabled={busy}
                      aria-label="Delete request"
                      className="grid place-items-center size-8 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] cursor-pointer disabled:opacity-60"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
