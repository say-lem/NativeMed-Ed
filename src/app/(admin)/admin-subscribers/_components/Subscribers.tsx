"use client";
import { useState } from "react";
import type { Subscriber } from "@/types/api";
import { useAdminList } from "../../_components/AdminListContext";
import Pagination from "../../_components/Pagination";

const TABS = ["All", "Active", "Expired"] as const;
type Tab = (typeof TABS)[number];

const PAGE_SIZE = 8;

const colGrid =
  "grid grid-cols-[1.3fr_1.6fr_1.6fr_1fr_auto] items-center gap-6";

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

function StatusBadge({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-[2px] rounded-[33px] text-[13px] font-semibold leading-[150%] tracking-[0.01em] ${
        isActive ? "bg-[#E5FFEA] text-[#027A48]" : "bg-[#FFE6E6] text-[#C11616]"
      }`}
    >
      {label}
    </span>
  );
}

export default function Subscribers({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const [tab, setTab] = useState<Tab>("All");
  const { query, page, setPage } = useAdminList();

  const q = query.trim().toLowerCase();
  const filtered = subscribers.filter((s) => {
    const status = s.status.toLowerCase();
    const byTab =
      tab === "All"
        ? true
        : tab === "Active"
          ? status === "active"
          : status !== "active";
    if (!byTab) return false;
    if (!q) return true;
    return [s.name, s.email, s.subscriptionPlan, s.subscribedTo].some((f) =>
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
        <div className="min-w-[820px] rounded-[8px] border border-[#EDEDED] overflow-hidden">
          {/* Header */}
          <div
            className={`${colGrid} bg-primary-10 border-b-[0.5px] border-[#B7B7B9] px-4 sm:px-6 py-3`}
          >
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Name</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Email</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Subscribed To</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Expires</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D] justify-self-end">Status</span>
          </div>

          {/* Rows */}
          {rows.length === 0 ? (
            <p className="text-center text-subtle-text py-10">
              {q
                ? "No subscribers match your search."
                : `No ${tab.toLowerCase()} subscribers.`}
            </p>
          ) : (
            rows.map((sub, idx) => (
              <div
                key={`${sub.email}-${sub.subscribedTo}-${idx}`}
                className={`${colGrid} border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-4`}
              >
                <p className="text-[15px] font-semibold leading-[120%] tracking-[-0.02em] text-[#080A0D] truncate">
                  {sub.name}
                </p>
                <p className="text-sm font-normal leading-[150%] text-subtle-text truncate">
                  {sub.email}
                </p>
                <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-black truncate">
                  {sub.subscribedTo}
                </p>
                <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-[#080A0D] whitespace-nowrap">
                  {formatDate(sub.expiryDate)}
                </p>
                <div className="justify-self-end">
                  <StatusBadge status={sub.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Pagination totalPages={totalPages} />
    </section>
  );
}
