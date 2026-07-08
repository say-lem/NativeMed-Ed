"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Course, Enrollment, User } from "@/types/api";
import { useAdminList } from "../../_components/AdminListContext";
import Pagination from "../../_components/Pagination";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import GrantAccessModal from "./GrantAccessModal";
import EnrollmentDetailModal from "./EnrollmentDetailModal";
import {
  manualEnrollAction,
  restoreEnrollAction,
  revokeEnrollAction,
} from "../actions";

const TABS = ["All", "Active", "Revoked"] as const;
type Tab = (typeof TABS)[number];
const PAGE_SIZE = 8;

const colGrid = "grid grid-cols-[1.4fr_1.4fr_0.8fr_0.8fr_120px] items-center gap-6";

function extractUser(e: Enrollment): { id: string; name: string; email?: string } {
  const u = e.userId;
  if (u && typeof u === "object")
    return { id: u._id ?? "", name: u.fullName ?? u.email ?? u._id, email: u.email };
  return { id: typeof u === "string" ? u : "", name: typeof u === "string" ? u : "—" };
}

function extractCourse(e: Enrollment): { id: string; title: string } {
  const c = e.courseId;
  if (c && typeof c === "object")
    return { id: c._id ?? "", title: c.title ?? c._id };
  return { id: typeof c === "string" ? c : "", title: typeof c === "string" ? c : "—" };
}

function statusOf(e: Enrollment): "active" | "revoked" {
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

export default function Enrollments({
  enrollments,
  users,
  courses,
}: {
  enrollments: Enrollment[];
  users: User[];
  courses: Course[];
}) {
  const [tab, setTab] = useState<Tab>("All");
  const { query, page, setPage } = useAdminList();
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startAction] = useTransition();
  const [granting, setGranting] = useState(false);
  const [savingGrant, startGrant] = useTransition();
  const [selected, setSelected] = useState<Enrollment | null>(null);

  const grant = (userId: string, courseId: string) => {
    startGrant(async () => {
      const res = await manualEnrollAction(userId, courseId);
      if (res.ok) {
        toast.success(res.message ?? "Access granted");
        setGranting(false);
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const revoke = async (e: Enrollment) => {
    const u = extractUser(e);
    const c = extractCourse(e);
    const ok = await confirm({
      title: "Revoke access?",
      message: `${u.name} will lose access to ${c.title}.`,
      confirmText: "Revoke",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(e._id);
    startAction(async () => {
      const res = await revokeEnrollAction(u.id, c.id);
      if (res.ok) toast.success(res.message ?? "Access revoked");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      setSelected(null);
      router.refresh();
    });
  };

  const restore = (e: Enrollment) => {
    setBusyId(e._id);
    startAction(async () => {
      const res = await restoreEnrollAction(e._id);
      if (res.ok) toast.success(res.message ?? "Access restored");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      setSelected(null);
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
    const c = extractCourse(e);
    return [u.name, u.email, c.title].some((f) => f?.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectTab = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10">
      {/* Tabs + grant */}
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
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setGranting(true)}
          className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer mb-2"
        >
          <Plus size={16} /> Grant Access
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <div className="min-w-[820px] rounded-[8px] border border-[#EDEDED] overflow-hidden">
          <div
            className={`${colGrid} bg-primary-10 border-b-[0.5px] border-[#B7B7B9] px-4 sm:px-6 py-3`}
          >
            <span className="text-base text-[#080A0D]">User</span>
            <span className="text-base text-[#080A0D]">Course</span>
            <span className="text-base text-[#080A0D]">Source</span>
            <span className="text-base text-[#080A0D]">Status</span>
            <span className="text-base text-[#080A0D]">Action</span>
          </div>

          {rows.length === 0 ? (
            <p className="text-center text-subtle-text py-10">
              {q ? "No enrollments match your search." : "No enrollments yet."}
            </p>
          ) : (
            rows.map((e) => {
              const u = extractUser(e);
              const c = extractCourse(e);
              const status = statusOf(e);
              const busy = busyId === e._id;
              return (
                <div
                  key={e._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(e)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      setSelected(e);
                    }
                  }}
                  className={`${colGrid} border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-4 cursor-pointer hover:bg-[#FAFAFA] outline-none`}
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#080A0D] truncate">
                      {u.name}
                    </p>
                    {u.email && (
                      <p className="text-xs text-subtle-text truncate">{u.email}</p>
                    )}
                  </div>
                  <p className="text-sm text-black truncate">{c.title}</p>
                  <p className="text-sm text-subtle-text capitalize">
                    {e.source ?? "—"}
                  </p>
                  <div>
                    <StatusBadge status={status} />
                  </div>
                  {status === "active" ? (
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        revoke(e);
                      }}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] text-sm font-medium px-4 py-2 cursor-pointer disabled:opacity-60"
                    >
                      {busy && <Loader2 size={14} className="animate-spin" />}
                      Revoke
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        restore(e);
                      }}
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

      <Pagination totalPages={totalPages} />

      {granting && (
        <GrantAccessModal
          users={users}
          courses={courses}
          saving={savingGrant}
          onClose={() => setGranting(false)}
          onGrant={grant}
        />
      )}

      {selected && (
        <EnrollmentDetailModal
          user={extractUser(selected)}
          course={extractCourse(selected)}
          status={statusOf(selected)}
          source={selected.source}
          tier={selected.accessTier}
          createdAt={selected.accessGrantedAt ?? selected.createdAt}
          busy={busyId === selected._id}
          onClose={() => setSelected(null)}
          onRevoke={() => revoke(selected)}
          onRestore={() => restore(selected)}
        />
      )}
    </section>
  );
}
