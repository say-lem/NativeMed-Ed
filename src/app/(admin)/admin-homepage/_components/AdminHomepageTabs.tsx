"use client";
import { useState } from "react";
import HomepageStatsForm from "./HomepageStatsForm";
import YoutubeLinksManager from "./YoutubeLinksManager";
import FreeProductsManager from "./FreeProductsManager";
import LegalPagesManager from "./LegalPagesManager";
import LegalPageEditor from "./LegalPageEditor";
import FaqsManager from "./FaqsManager";
import { updateFounderBioAction } from "../actions";
import type { Faq, FreeProduct, LegalPageContent, YoutubeLink } from "@/types/api";

type Tab = "homepage" | "free-products" | "legal-pages" | "faqs" | "founder";

const TABS: { id: Tab; label: string }[] = [
  { id: "homepage", label: "Homepage" },
  { id: "free-products", label: "Free Products" },
  { id: "legal-pages", label: "Legal Pages" },
  { id: "faqs", label: "FAQs" },
  { id: "founder", label: "About the Founder" },
];

export default function AdminHomepageTabs({
  caseNumber,
  testimonialsCount,
  registrarsCount,
  contactEmail,
  contactPhone,
  youtubeLinks,
  freeProducts,
  terms,
  legalDisclaimer,
  privacyPolicy,
  faqs,
  founderBio,
}: {
  caseNumber: number;
  testimonialsCount: number;
  registrarsCount: number;
  contactEmail: string | null;
  contactPhone: string | null;
  youtubeLinks: YoutubeLink[];
  freeProducts: FreeProduct[];
  terms: LegalPageContent;
  legalDisclaimer: LegalPageContent;
  privacyPolicy: LegalPageContent;
  faqs: Faq[];
  founderBio: LegalPageContent;
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

      {tab === "homepage" && (
        <div className="space-y-6">
          <HomepageStatsForm
            caseNumber={caseNumber}
            testimonialsCount={testimonialsCount}
            registrarsCount={registrarsCount}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
          />
          <YoutubeLinksManager links={youtubeLinks} />
        </div>
      )}
      {tab === "free-products" && <FreeProductsManager products={freeProducts} />}
      {tab === "legal-pages" && (
        <LegalPagesManager
          terms={terms}
          legalDisclaimer={legalDisclaimer}
          privacyPolicy={privacyPolicy}
        />
      )}
      {tab === "faqs" && <FaqsManager faqs={faqs} />}
      {tab === "founder" && (
        <LegalPageEditor
          key="founder-bio"
          title="About the Founder"
          initialContent={founderBio.content}
          updatedAt={founderBio.updatedAt}
          action={updateFounderBioAction}
        />
      )}
    </div>
  );
}
