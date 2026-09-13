"use client";
import { useState } from "react";
import LegalPageEditor from "./LegalPageEditor";
import { updateLegalDisclaimerAction, updateTermsAndConditionsAction } from "../actions";
import type { LegalPageContent } from "@/types/api";

type LegalTab = "terms" | "legal-disclaimer";

const TABS: { id: LegalTab; label: string }[] = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "legal-disclaimer", label: "Legal Disclaimer" },
];

export default function LegalPagesManager({
  terms,
  legalDisclaimer,
}: {
  terms: LegalPageContent;
  legalDisclaimer: LegalPageContent;
}) {
  const [tab, setTab] = useState<LegalTab>("terms");

  return (
    <div className="space-y-6">
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

      {tab === "terms" ? (
        <LegalPageEditor
          key="terms"
          title="Terms & Conditions"
          initialContent={terms.content}
          updatedAt={terms.updatedAt}
          action={updateTermsAndConditionsAction}
        />
      ) : (
        <LegalPageEditor
          key="legal-disclaimer"
          title="Legal Disclaimer"
          initialContent={legalDisclaimer.content}
          updatedAt={legalDisclaimer.updatedAt}
          action={updateLegalDisclaimerAction}
        />
      )}
    </div>
  );
}
