"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types/api";
import { useAdminList } from "../../_components/AdminListContext";
import Pagination from "../../_components/Pagination";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import UserDetailModal from "./UserDetailModal";
import CreateAdminModal, { type CreateAdminValues } from "./CreateAdminModal";
import { createAdminAction, toggleUserStatusAction } from "../actions";

const TABS = ["All", "Active", "Inactive"] as const;
type Tab = (typeof TABS)[number];

const PAGE_SIZE = 8;

const colGrid =
  "grid grid-cols-[1.3fr_1.7fr_1.1fr_90px_0.7fr_1fr_110px_130px] items-center gap-5";

function isActiveUser(u: User): boolean {
  return u.isActive !== false;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-[2px] rounded-[33px] text-[13px] font-semibold leading-[150%] tracking-[0.01em] ${
        active ? "bg-[#E5FFEA] text-[#027A48]" : "bg-[#FFE6E6] text-[#C11616]"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function Users({ users }: { users: User[] }) {
  const [tab, setTab] = useState<Tab>("All");
  const { query, page, setPage } = useAdminList();
  const router = useRouter();
  const confirm = useConfirm();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [, startTransition] = useTransition();
  const [creating, setCreating] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string[]> | undefined>();
  const [savingCreate, startCreate] = useTransition();

  const createAdmin = (values: CreateAdminValues) => {
    startCreate(async () => {
      const res = await createAdminAction({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        temporaryPassword: values.temporaryPassword.trim() || undefined,
      });
      if (res.ok) {
        toast.success(res.message ?? "Admin account created");
        setCreating(false);
        setCreateErrors(undefined);
        router.refresh();
      } else {
        setCreateErrors(res.fieldErrors);
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const toggle = async (u: User, closeModal = false) => {
    const active = isActiveUser(u);
    if (active) {
      const ok = await confirm({
        title: "Deactivate user?",
        message: `${u.fullName} will lose access until reactivated.`,
        confirmText: "Deactivate",
        tone: "danger",
      });
      if (!ok) return;
    }
    setPendingId(u._id);
    startTransition(async () => {
      const res = await toggleUserStatusAction(u._id);
      if (res.ok) toast.success(active ? "User deactivated" : "User activated");
      else toast.error(res.message ?? "Something went wrong");
      setPendingId(null);
      if (closeModal) setSelected(null);
      router.refresh();
    });
  };

  const q = query.trim().toLowerCase();
  const filtered = users.filter((u) => {
    const active = isActiveUser(u);
    const byTab =
      tab === "All" ? true : tab === "Active" ? active : !active;
    if (!byTab) return false;
    if (!q) return true;
    return [
      u.fullName,
      u.email,
      u.phone,
      u.role,
      u.telegramUsername,
      u.examSitting,
    ].some((f) =>
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

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10">
      {/* Create admin */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer"
        >
          <UserPlus size={16} /> Create Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#EDEDED]">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => selectTab(t)}
              className={`p-4 text-base font-semibold leading-[120%] tracking-[-0.01em] cursor-pointer border-b-[2.5px] -mb-px ${
                active
                  ? "text-[#7A51C2] border-[#7A51C2]"
                  : "text-subtle-text border-transparent"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <div className="min-w-[1140px] rounded-[8px] border border-[#EDEDED] overflow-hidden">
          {/* Header */}
          <div
            className={`${colGrid} bg-primary-10 border-b-[0.5px] border-[#B7B7B9] px-4 sm:px-6 py-3`}
          >
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Name</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Email</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Telegram</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Exam</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Role</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Joined</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Status</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Action</span>
          </div>

          {/* Rows */}
          {rows.length === 0 ? (
            <p className="text-center text-subtle-text py-10">
              {q
                ? "No users match your search."
                : `No ${tab.toLowerCase()} users.`}
            </p>
          ) : (
            rows.map((u) => {
              const active = isActiveUser(u);
              return (
                <div
                  key={u._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(u)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(u);
                    }
                  }}
                  className={`${colGrid} border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-4 cursor-pointer hover:bg-[#FAFAFA] outline-none`}
                >
                  <p className="text-[15px] font-semibold leading-[120%] tracking-[-0.02em] text-[#080A0D] truncate">
                    {u.fullName}
                  </p>
                  <p className="text-sm font-normal leading-[150%] text-subtle-text truncate">
                    {u.email}
                  </p>
                  {/* Collected at signup since 2026-08-12 — older accounts show a dash. */}
                  <p className="text-sm font-normal leading-[150%] text-subtle-text truncate">
                    {u.telegramUsername || "—"}
                  </p>
                  <p className="text-sm font-normal leading-[150%] text-subtle-text whitespace-nowrap">
                    {u.examSitting || "—"}
                  </p>
                  <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-black capitalize">
                    {u.role}
                  </p>
                  <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-[#080A0D] whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </p>
                  <div>
                    <StatusBadge active={active} />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(u);
                    }}
                    disabled={pendingId === u._id || (active && u.role === "admin")}
                    title={
                      active && u.role === "admin"
                        ? "Admin accounts can't be deactivated here"
                        : undefined
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-[8px] text-sm font-medium px-4 py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      active
                        ? "border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6]"
                        : "border border-primary-100 text-primary-100 hover:bg-primary-10"
                    }`}
                  >
                    {pendingId === u._id && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    {active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Pagination totalPages={totalPages} />

      {selected && (
        <UserDetailModal
          user={selected}
          onClose={() => setSelected(null)}
          onToggle={() => toggle(selected, true)}
          pending={pendingId === selected._id}
        />
      )}

      {creating && (
        <CreateAdminModal
          saving={savingCreate}
          fieldErrors={createErrors}
          onClose={() => {
            setCreating(false);
            setCreateErrors(undefined);
          }}
          onSubmit={createAdmin}
        />
      )}
    </section>
  );
}
