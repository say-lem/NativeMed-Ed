"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import type { YoutubeLink } from "@/types/api";
import YoutubeLinkFormModal from "./YoutubeLinkFormModal";
import { deleteYoutubeLinkAction } from "../actions";

export default function YoutubeLinksManager({ links }: { links: YoutubeLink[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<YoutubeLink | null>(null);
  const [, startAction] = useTransition();

  const sorted = [...links].sort((a, b) => a.order - b.order);

  const remove = async (link: YoutubeLink) => {
    const ok = await confirm({
      title: "Delete video?",
      message: `"${link.title}" will be removed from the home page.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(link._id);
    startAction(async () => {
      const res = await deleteYoutubeLinkAction(link._id);
      if (res.ok) toast.success(res.message ?? "Video deleted");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black-others">
            Featured videos ({links.length})
          </h2>
          <p className="mt-1 text-sm text-subtle-text">
            Shown in the &quot;Watch &amp; Learn&quot; section on the home page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      <div className="mt-5 divide-y divide-[#EDEDED]">
        {sorted.length === 0 ? (
          <p className="text-center text-subtle-text py-10">
            No videos yet. Add one to show it on the home page.
          </p>
        ) : (
          sorted.map((link) => {
            const busy = busyId === link._id;
            return (
              <div
                key={link._id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-black-others truncate">
                    {link.title}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-100 hover:underline break-all"
                  >
                    {link.url}
                  </a>
                  <p className="text-xs text-subtle-text mt-0.5">Order: {link.order}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditing(link)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(link)}
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

      {creating && (
        <YoutubeLinkFormModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      )}

      {editing && (
        <YoutubeLinkFormModal
          link={editing}
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
