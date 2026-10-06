"use client";
import { useState } from "react";
import HomepageStatsForm from "./HomepageStatsForm";
import YoutubeLinksManager from "./YoutubeLinksManager";
import FreeProductsManager from "./FreeProductsManager";
import LegalPagesManager from "./LegalPagesManager";
import FounderBioEditor from "./FounderBioEditor";
import FaqsManager from "./FaqsManager";
import type { Faq, FounderBioContent, FreeProduct, LegalPageContent, YoutubeLink } from "@/types/api";

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
  facebookUrl,
  whatsappUrl,
  twitterUrl,
  instagramUrl,
  youtubeUrl,
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
  facebookUrl: string | null;
  whatsappUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  youtubeLinks: YoutubeLink[];
  freeProducts: FreeProduct[];
  terms: LegalPageContent;
  legalDisclaimer: LegalPageContent;
  privacyPolicy: LegalPageContent;
  faqs: Faq[];
  founderBio: FounderBioContent;
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
            facebookUrl={facebookUrl}
            whatsappUrl={whatsappUrl}
            twitterUrl={twitterUrl}
            instagramUrl={instagramUrl}
            youtubeUrl={youtubeUrl}
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
      {tab === "founder" && <FounderBioEditor founderBio={founderBio} />}
    </div>
  );
}
