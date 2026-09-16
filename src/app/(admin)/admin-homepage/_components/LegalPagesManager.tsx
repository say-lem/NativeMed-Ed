"use client";
import { useState } from "react";
import LegalPageEditor from "./LegalPageEditor";
import {
  updateLegalDisclaimerAction,
  updatePrivacyPolicyAction,
  updateTermsAndConditionsAction,
} from "../actions";
import type { LegalPageContent } from "@/types/api";

type LegalTab = "terms" | "legal-disclaimer" | "privacy-policy";

const TABS: { id: LegalTab; label: string }[] = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "legal-disclaimer", label: "Legal Disclaimer" },
  { id: "privacy-policy", label: "Privacy Policy" },
];

export default function LegalPagesManager({
  terms,
  legalDisclaimer,
  privacyPolicy,
}: {
  terms: LegalPageContent;
  legalDisclaimer: LegalPageContent;
  privacyPolicy: LegalPageContent;
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

      {tab === "terms" && (
        <LegalPageEditor
          key="terms"
          title="Terms & Conditions"
          initialContent={terms.content}
          updatedAt={terms.updatedAt}
          action={updateTermsAndConditionsAction}
        />
      )}
      {tab === "legal-disclaimer" && (
        <LegalPageEditor
          key="legal-disclaimer"
          title="Legal Disclaimer"
          initialContent={legalDisclaimer.content}
          updatedAt={legalDisclaimer.updatedAt}
          action={updateLegalDisclaimerAction}
        />
      )}
      {tab === "privacy-policy" && (
        <LegalPageEditor
          key="privacy-policy"
          title="Privacy Policy"
          initialContent={privacyPolicy.content}
          updatedAt={privacyPolicy.updatedAt}
          action={updatePrivacyPolicyAction}
        />
      )}
    </div>
  );
}
