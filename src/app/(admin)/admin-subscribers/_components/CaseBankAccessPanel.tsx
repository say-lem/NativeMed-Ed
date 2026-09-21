"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, PauseCircle, PlayCircle, UserCheck, UserMinus, UserPlus } from "lucide-react";
import type { User } from "@/types/api";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import CaseBankAccessModal, { type CaseBankAccessMode } from "./CaseBankAccessModal";
import {
  grantCaseBankAccessAction,
  pauseCaseBankPaymentsAction,
  restoreCaseBankAccessAction,
  resumeCaseBankPaymentsAction,
  revokeCaseBankAccessAction,
} from "../actions";

const ACTIONS: Record<
  CaseBankAccessMode,
  (userId: string, durationDays: number) => ReturnType<typeof grantCaseBankAccessAction>
> = {
  grant: grantCaseBankAccessAction,
  revoke: (userId) => revokeCaseBankAccessAction(userId),
  restore: restoreCaseBankAccessAction,
};

export default function CaseBankAccessPanel({
  users,
  initialPaymentsPaused,
}: {
  users: User[];
  initialPaymentsPaused: boolean;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [modal, setModal] = useState<CaseBankAccessMode | null>(null);
  const [saving, startSaving] = useTransition();
  const [pausing, startPausing] = useTransition();
  const [paused, setPaused] = useState(initialPaymentsPaused);

  const submit = (userId: string, durationDays: number) => {
    if (!modal) return;
    startSaving(async () => {
      const res = await ACTIONS[modal](userId, durationDays);
      if (res.ok) {
        toast.success(res.message ?? "Done");
        setModal(null);
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const togglePayments = async () => {
    if (!paused) {
      const ok = await confirm({
        title: "Pause Case Bank payments?",
        message:
          "New purchases will be blocked. Existing subscribers keep their access until it lapses.",
        confirmText: "Pause payments",
        tone: "danger",
      });
      if (!ok) return;
    }
    startPausing(async () => {
      const res = paused
        ? await resumeCaseBankPaymentsAction()
        : await pauseCaseBankPaymentsAction();
      if (res.ok) {
        toast.success(res.message ?? "Updated");
        setPaused(!paused);
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-black-others">Case Bank Access</h2>
        <p className="mt-1 text-sm text-subtle-text">
          Manually grant, revoke or restore a user&apos;s Case Bank access.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setModal("grant")}
            className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer"
          >
            <UserPlus size={16} /> Grant Access
          </button>
          <button
            type="button"
            onClick={() => setModal("revoke")}
            className="flex items-center gap-2 rounded-full border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] text-sm font-semibold px-5 py-2.5 cursor-pointer"
          >
            <UserMinus size={16} /> Revoke Access
          </button>
          <button
            type="button"
            onClick={() => setModal("restore")}
            className="flex items-center gap-2 rounded-full border border-primary-100 text-primary-100 hover:bg-primary-10 text-sm font-semibold px-5 py-2.5 cursor-pointer"
          >
            <UserCheck size={16} /> Restore Access
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-[#EDEDED]">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-black-others">Case Bank Payments</h3>
          <span
            className={`inline-flex items-center px-3 py-[2px] rounded-[33px] text-[13px] font-semibold ${
              paused ? "bg-[#FFE6E6] text-[#C11616]" : "bg-[#E5FFEA] text-[#027A48]"
            }`}
          >
            {paused ? "Paused" : "Active"}
          </span>
        </div>
        <p className="mt-1 text-xs text-subtle-text">
          Blocks new Case Bank purchases site-wide without touching existing subscribers.
        </p>
        <div className="mt-3">
          <button
            type="button"
            onClick={togglePayments}
            disabled={pausing}
            className={`flex items-center gap-1.5 rounded-[8px] border text-sm font-medium px-4 py-2 cursor-pointer disabled:opacity-60 ${
              paused
                ? "border-primary-100 text-primary-100 hover:bg-primary-10"
                : "border-gray-1 text-subtle-text hover:bg-gray-100"
            }`}
          >
            {pausing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : paused ? (
              <PlayCircle size={14} />
            ) : (
              <PauseCircle size={14} />
            )}
            {paused ? "Resume Payments" : "Pause Payments"}
          </button>
        </div>
      </div>

      {modal && (
        <CaseBankAccessModal
          mode={modal}
          users={users}
          saving={saving}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}
