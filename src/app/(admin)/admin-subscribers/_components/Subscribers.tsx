"use client";
import { useState } from "react";

type Status = "Active" | "Expired";

type Subscriber = {
  name: string;
  email: string;
  plan: string;
  expires: string;
  status: Status;
};

const subscribers: Subscriber[] = [
  { name: "Dr. Amara Okafor", email: "amara.o@nhs.net", plan: "MRCGP SCA Revision Monthly", expires: "14 Jun 2025", status: "Active" },
  { name: "Dr. Amara Okafor", email: "amara.o@nhs.net", plan: "MRCGP SCA Revision Monthly", expires: "14 Jun 2025", status: "Expired" },
  { name: "Dr. Amara Okafor", email: "amara.o@nhs.net", plan: "MRCGP SCA Revision Monthly", expires: "14 Jun 2025", status: "Active" },
  { name: "Dr. Liam Chen", email: "liam.c@healthcare.org", plan: "MRCGP SCA Revision Monthly", expires: "22 Aug 2024", status: "Active" },
  { name: "Dr. Priya Singh", email: "priya.s@medclinic.com", plan: "MRCGP SCA Revision Monthly", expires: "05 Feb 2026", status: "Active" },
  { name: "Dr. Amara Okafor", email: "amara.o@nhs.net", plan: "MRCGP SCA Revision Monthly", expires: "14 Jun 2025", status: "Expired" },
  { name: "Dr. Ethan Patel", email: "ethan.p@cityhospital.com", plan: "MRCGP SCA Revision Monthly", expires: "30 Nov 2023", status: "Active" },
  { name: "Dr. Isabella Rossi", email: "isabella.r@univhealth.edu", plan: "MRCGP SCA Revision Monthly", expires: "17 Mar 2025", status: "Active" },
  { name: "Dr. Noah Kim", email: "noah.k@wellnesscenter.net", plan: "MRCGP SCA Revision Monthly", expires: "01 Jan 2024", status: "Active" },
  { name: "Dr. Priya Singh", email: "priya.s@medclinic.com", plan: "MRCGP SCA Revision Monthly", expires: "05 Feb 2026", status: "Active" },
];

const TABS = ["All", "Active", "Expired"] as const;
type Tab = (typeof TABS)[number];

const colGrid =
  "grid grid-cols-[1.3fr_1.6fr_1.6fr_1fr_auto] items-center gap-6";

function StatusBadge({ status }: { status: Status }) {
  const styles =
    status === "Active"
      ? "bg-[#E5FFEA] text-[#027A48]"
      : "bg-[#FFE6E6] text-[#C11616]";
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-[2px] rounded-[33px] text-[13px] font-semibold leading-[150%] tracking-[0.01em] ${styles}`}
    >
      {status}
    </span>
  );
}

export default function Subscribers() {
  const [tab, setTab] = useState<Tab>("All");

  const rows = subscribers.filter((s) =>
    tab === "All" ? true : s.status === tab,
  );

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10">
      {/* Tabs */}
      <div className="flex items-center border-b border-[#EDEDED]">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
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
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Plan</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D]">Expires</span>
            <span className="text-base font-normal leading-[150%] text-[#080A0D] justify-self-end">Status</span>
          </div>

          {/* Rows */}
          {rows.length === 0 ? (
            <p className="text-center text-subtle-text py-10">
              No {tab.toLowerCase()} subscribers.
            </p>
          ) : (
            rows.map((sub, idx) => (
              <div
                key={`${sub.email}-${idx}`}
                className={`${colGrid} border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-4`}
              >
                <p className="text-[15px] font-semibold leading-[120%] tracking-[-0.02em] text-[#080A0D] truncate">
                  {sub.name}
                </p>
                <p className="text-sm font-normal leading-[150%] text-subtle-text truncate">
                  {sub.email}
                </p>
                <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-black truncate">
                  {sub.plan}
                </p>
                <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-[#080A0D] whitespace-nowrap">
                  {sub.expires}
                </p>
                <div className="justify-self-end">
                  <StatusBadge status={sub.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
