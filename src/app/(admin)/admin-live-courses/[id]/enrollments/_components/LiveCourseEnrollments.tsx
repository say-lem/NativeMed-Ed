"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { LiveCourseEnrollment, User } from "@/types/api";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import GrantLiveCourseAccessModal from "./GrantLiveCourseAccessModal";
import {
  manualEnrollLiveCourseAction,
  restoreLiveCourseEnrollAction,
  revokeLiveCourseEnrollAction,
} from "../actions";

const TABS = ["All", "Active", "Revoked"] as const;
type Tab = (typeof TABS)[number];

const colGrid = "grid grid-cols-[1.6fr_1fr_1fr_120px] items-center gap-6";

function extractUser(e: LiveCourseEnrollment): { id: string; name: string; email?: string } {
  const u = e.userId;
  if (u && typeof u === "object")
    return { id: u._id ?? "", name: u.fullName ?? u.email ?? u._id, email: u.email };
  return { id: typeof u === "string" ? u : "", name: typeof u === "string" ? u : "—" };
}

function statusOf(e: LiveCourseEnrollment): "active" | "revoked" {
  return e.isActive === false ? "revoked" : "active";
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-[2px] rounded-[33px] text-[13px] font-semibold ${
        active ? "bg-[#E5FFEA] text-[#027A48]" : "bg-[#FFE6E6] text-[#C11616]"
      }`}
    >
      {active ? "Active" : "Revoked"}
    </span>
  );
}

export default function LiveCourseEnrollments({
  courseId,
  enrollments,
  users,
}: {
  courseId: string;
  enrollments: LiveCourseEnrollment[];
  users: User[];
}) {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startAction] = useTransition();
  const [granting, setGranting] = useState(false);
  const [savingGrant, startGrant] = useTransition();

  const grant = (userId: string) => {
    startGrant(async () => {
      const res = await manualEnrollLiveCourseAction(courseId, userId);
      if (res.ok) {
        toast.success(res.message ?? "Access granted");
        setGranting(false);
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const revoke = async (e: LiveCourseEnrollment) => {
    const u = extractUser(e);
    const ok = await confirm({
      title: "Revoke access?",
      message: `${u.name} will lose access to this live course.`,
      confirmText: "Revoke",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(e._id);
    startAction(async () => {
      const res = await revokeLiveCourseEnrollAction(courseId, u.id);
      if (res.ok) toast.success(res.message ?? "Access revoked");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const restore = (e: LiveCourseEnrollment) => {
    setBusyId(e._id);
    startAction(async () => {
      const res = await restoreLiveCourseEnrollAction(courseId, e._id);
      if (res.ok) toast.success(res.message ?? "Access restored");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const q = query.trim().toLowerCase();
  const filtered = enrollments.filter((e) => {
    const status = statusOf(e);
    const byTab =
      tab === "All" ? true : tab === "Active" ? status === "active" : status === "revoked";
    if (!byTab) return false;
    if (!q) return true;
    const u = extractUser(e);
    return [u.name, u.email].some((f) => f?.toLowerCase().includes(q));
  });

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10">
      {/* Search + grant */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle-text" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-[8px] border border-gray-1 pl-9 pr-3 py-2 text-sm outline-none focus:border-primary-100"
          />
        </div>
        <button
          type="button"
          onClick={() => setGranting(true)}
          className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer"
        >
          <Plus size={16} /> Grant Access
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#EDEDED]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`p-4 text-base font-semibold cursor-pointer border-b-[2.5px] -mb-px ${
              tab === t
                ? "text-[#7A51C2] border-[#7A51C2]"
                : "text-subtle-text border-transparent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <div className="min-w-[640px] rounded-[8px] border border-[#EDEDED] overflow-hidden">
          <div
            className={`${colGrid} bg-primary-10 border-b-[0.5px] border-[#B7B7B9] px-4 sm:px-6 py-3`}
          >
            <span className="text-base text-[#080A0D]">User</span>
            <span className="text-base text-[#080A0D]">Source</span>
            <span className="text-base text-[#080A0D]">Status</span>
            <span className="text-base text-[#080A0D]">Action</span>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-subtle-text py-10">
              {q ? "No enrollments match your search." : "No enrollments yet."}
            </p>
          ) : (
            filtered.map((e) => {
              const u = extractUser(e);
              const status = statusOf(e);
              const busy = busyId === e._id;
              return (
                <div
                  key={e._id}
                  className={`${colGrid} border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-4`}
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#080A0D] truncate">
                      {u.name}
                    </p>
                    {u.email && (
                      <p className="text-xs text-subtle-text truncate">{u.email}</p>
                    )}
                  </div>
                  <p className="text-sm text-subtle-text capitalize">{e.source ?? "—"}</p>
                  <div>
                    <StatusBadge status={status} />
                  </div>
                  {status === "active" ? (
                    <button
                      type="button"
                      onClick={() => revoke(e)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] text-sm font-medium px-4 py-2 cursor-pointer disabled:opacity-60"
                    >
                      {busy && <Loader2 size={14} className="animate-spin" />}
                      Revoke
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => restore(e)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 rounded-[8px] border border-primary-100 text-primary-100 hover:bg-primary-10 text-sm font-medium px-4 py-2 cursor-pointer disabled:opacity-60"
                    >
                      {busy && <Loader2 size={14} className="animate-spin" />}
                      Restore
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {granting && (
        <GrantLiveCourseAccessModal
          users={users}
          saving={savingGrant}
          onClose={() => setGranting(false)}
          onGrant={grant}
        />
      )}
    </section>
  );
}
