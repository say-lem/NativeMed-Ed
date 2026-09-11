"use client";
import { useState } from "react";
import HomepageStatsForm from "./HomepageStatsForm";
import YoutubeLinksManager from "./YoutubeLinksManager";
import FreeProductsManager from "./FreeProductsManager";
import type { FreeProduct, YoutubeLink } from "@/types/api";

type Tab = "homepage" | "free-products";

const TABS: { id: Tab; label: string }[] = [
  { id: "homepage", label: "Homepage" },
  { id: "free-products", label: "Free Products" },
];

export default function AdminHomepageTabs({
  caseNumber,
  testimonialsCount,
  registrarsCount,
  youtubeLinks,
  freeProducts,
}: {
  caseNumber: number;
  testimonialsCount: number;
  registrarsCount: number;
  youtubeLinks: YoutubeLink[];
  freeProducts: FreeProduct[];
}) {
  const [tab, setTab] = useState<Tab>("homepage");

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-6 mb-10 space-y-6">
      <div className="inline-flex rounded-[8px] border border-[#EDEDED] p-1 bg-gray-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-[6px] text-sm font-semibold cursor-pointer ${
              tab === t.id ? "bg-white shadow-sm text-primary-100" : "text-subtle-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "homepage" ? (
        <div className="space-y-6">
          <HomepageStatsForm
            caseNumber={caseNumber}
            testimonialsCount={testimonialsCount}
            registrarsCount={registrarsCount}
          />
          <YoutubeLinksManager links={youtubeLinks} />
        </div>
      ) : (
        <FreeProductsManager products={freeProducts} />
      )}
    </div>
  );
}
