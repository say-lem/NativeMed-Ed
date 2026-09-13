"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/date";
import type { BookingProduct } from "@/types/api";
import { addAvailableDateAction, removeAvailableDateAction } from "../actions";

const inputClass =
  "border-[0.5px] rounded-[8px] px-4 py-2.5 border-secondary-20 w-full outline-none focus:border-primary-100 text-black-others";

export default function ManageDatesModal({
  product,
  onClose,
}: {
  product: BookingProduct;
  onClose: () => void;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [date, setDate] = useState("");
  const [adding, startAdd] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startRemove] = useTransition();

  const sorted = [...product.availableDates].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const add = () => {
    if (!date) {
      toast.error("Choose a date first");
      return;
    }
    startAdd(async () => {
      const res = await addAvailableDateAction(product._id, date);
      if (res.ok) {
        toast.success(res.message ?? "Date added");
        setDate("");
        router.refresh();
      } else {
        toast.error(res.message ?? "Couldn't add the date.");
      }
    });
  };

  const remove = async (dateId: string, label: string) => {
    const ok = await confirm({
      title: "Remove this date?",
      message: `${label} will no longer be available to book.`,
      confirmText: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(dateId);
    startRemove(async () => {
      const res = await removeAvailableDateAction(product._id, dateId);
      if (res.ok) toast.success(res.message ?? "Date removed");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

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
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-subtle-text hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-black-others">Manage Dates</h2>
        <p className="mt-1 text-sm text-subtle-text">{product.title}</p>

        <div className="mt-5 flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={add}
            disabled={adding}
            className="shrink-0 grid place-items-center size-10 rounded-[8px] bg-primary-100 text-white cursor-pointer disabled:opacity-60"
            aria-label="Add date"
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          </button>
        </div>

        <div className="mt-5 divide-y divide-[#EDEDED] max-h-[300px] overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="text-center text-subtle-text py-6 text-sm">No dates added yet.</p>
          ) : (
            sorted.map((d) => {
              const busy = busyId === d._id;
              const label = formatDate(d.date);
              return (
                <div key={d._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-black-others">{label}</span>
                    {d.isBooked && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-subtle-text">
                        Booked
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(d._id, label)}
                    disabled={busy || d.isBooked}
                    title={d.isBooked ? "Booked dates can't be removed here" : "Remove date"}
                    className="shrink-0 grid place-items-center size-8 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
