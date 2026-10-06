"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/date";
import type { Feedback } from "@/types/api";
import { deleteFeedbackAction } from "../actions";

export default function FeedbackWidget({ feedback }: { feedback: Feedback[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startAction] = useTransition();

  const remove = async (item: Feedback) => {
    const ok = await confirm({
      title: "Delete feedback?",
      message: "This feedback message will be permanently removed.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(item._id);
    startAction(async () => {
      const res = await deleteFeedbackAction(item._id);
      if (res.ok) toast.success(res.message ?? "Feedback deleted");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10">
      <h1 className="text-2xl leading-[130%] tracking-[-2%] text-black font-semibold mb-4">
        Feedback ({feedback.length})
      </h1>

      {feedback.length === 0 ? (
        <p className="text-subtle-text py-6">No feedback yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-[#EDEDED] max-h-[480px] overflow-y-auto rounded-[8px] border border-[#EDEDED]">
          {feedback.map((item) => {
            const busy = busyId === item._id;
            return (
              <div
                key={item._id}
                className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-[15px] font-semibold leading-[120%] tracking-[-0.02em] text-black-others">
                      {item.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-subtle-text whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-subtle-text mt-1 whitespace-pre-wrap">
                    {item.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  disabled={busy}
                  aria-label="Delete feedback"
                  className="shrink-0 grid place-items-center size-8 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] cursor-pointer disabled:opacity-60"
                >
                  {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
