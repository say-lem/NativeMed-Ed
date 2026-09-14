"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import type { Faq } from "@/types/api";
import FaqFormModal from "./FaqFormModal";
import { deleteFaqAction } from "../actions";

const PAGE_SIZE = 7;

export default function FaqsManager({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [page, setPage] = useState(1);
  const [, startAction] = useTransition();

  const sorted = [...faqs].sort((a, b) => a.order - b.order);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  // Clamp rather than store the clamped value: deleting the last item on the last page
  // (or any list-shrinking edit) shouldn't strand `page` past the new `totalPages`.
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const remove = async (faq: Faq) => {
    const ok = await confirm({
      title: "Delete FAQ?",
      message: `"${faq.question}" will be removed from the home page.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(faq._id);
    startAction(async () => {
      const res = await deleteFaqAction(faq._id);
      if (res.ok) toast.success(res.message ?? "FAQ deleted");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black-others">FAQs ({faqs.length})</h2>
          <p className="mt-1 text-sm text-subtle-text">
            Shown in the &quot;Your Questions answered&quot; section on the home page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="mt-5 divide-y divide-[#EDEDED]">
        {sorted.length === 0 ? (
          <p className="text-center text-subtle-text py-10">
            No FAQs yet. Add one to show it on the home page.
          </p>
        ) : (
          pageItems.map((faq) => {
            const busy = busyId === faq._id;
            return (
              <div key={faq._id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-black-others">{faq.question}</p>
                  <p className="text-xs text-subtle-text mt-1 line-clamp-2">{faq.answer}</p>
                  <p className="text-xs text-subtle-text mt-0.5">Order: {faq.order}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditing(faq)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(faq)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {busy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="min-w-20 h-9 px-3 rounded-[6px] border border-[#E0E0E0] text-sm font-medium text-black-others hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-subtle-text">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="min-w-20 h-9 px-3 rounded-[6px] border border-[#E0E0E0] text-sm font-medium text-black-others hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {creating && (
        <FaqFormModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      )}

      {editing && (
        <FaqFormModal
          faq={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
