"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Activity } from "@/types/api";
import { formatDate } from "@/lib/date";
import { useAdminList } from "../../_components/AdminListContext";
import Pagination from "../../_components/Pagination";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import EventFormModal from "./EventFormModal";
import { deleteActivityAction } from "../actions";

const TABS = ["Upcoming", "Past", "All"] as const;
type Tab = (typeof TABS)[number];
const PAGE_SIZE = 8;

const colGrid = "grid grid-cols-[140px_1fr_160px] items-center gap-6";

function isUpcoming(e: Activity): boolean {
  return new Date(e.date).getTime() >= Date.now();
}

export default function AdminEvents({ events }: { events: Activity[] }) {
  const [tab, setTab] = useState<Tab>("Upcoming");
  const { query, page, setPage } = useAdminList();
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [, startAction] = useTransition();

  const remove = async (e: Activity) => {
    const ok = await confirm({
      title: "Delete event?",
      message: "This event will be permanently removed from the homepage.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(e._id);
    startAction(async () => {
      const res = await deleteActivityAction(e._id);
      if (res.ok) toast.success(res.message ?? "Event deleted");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const q = query.trim().toLowerCase();
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const filtered = sorted.filter((e) => {
    const byTab =
      tab === "All" ? true : tab === "Upcoming" ? isUpcoming(e) : !isUpcoming(e);
    if (!byTab) return false;
    if (!q) return true;
    return e.description.toLowerCase().includes(q);
  });
  if (tab === "Past") filtered.reverse();

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectTab = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  const countFor = (t: Tab) =>
    t === "All" ? events.length : events.filter((e) => (t === "Upcoming" ? isUpcoming(e) : !isUpcoming(e))).length;

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDEDED]">
        <div className="flex items-center">
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
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer mb-2"
        >
          <Plus size={16} /> Post Event
        </button>
      </div>

      <div className="overflow-x-auto mt-6">
        <div className="min-w-[700px] rounded-[8px] border border-[#EDEDED] overflow-hidden">
          <div
            className={`${colGrid} bg-primary-10 border-b-[0.5px] border-[#B7B7B9] px-4 sm:px-6 py-3`}
          >
            <span className="text-base text-[#080A0D]">Date</span>
            <span className="text-base text-[#080A0D]">Description</span>
            <span className="text-base text-[#080A0D]">Action</span>
          </div>

          {rows.length === 0 ? (
            <p className="text-center text-subtle-text py-10">
              {q ? "No events match your search." : "No events here."}
            </p>
          ) : (
            rows.map((e) => {
              const busy = busyId === e._id;
              return (
                <div
                  key={e._id}
                  className={`${colGrid} border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-4`}
                >
                  <p className="text-sm font-semibold text-[#080A0D]">
                    {formatDate(e.date)}
                  </p>
                  <p className="text-sm text-black line-clamp-2">{e.description}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(e)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(e)}
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
      </div>

      <Pagination totalPages={totalPages} />

      {creating && (
        <EventFormModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      )}

      {editing && (
        <EventFormModal
          event={editing}
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
