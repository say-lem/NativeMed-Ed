import AdminHomepageHero from "./_components/AdminHomepageHero";
import AdminHomepageTabs from "./_components/AdminHomepageTabs";
import {
  getHomepageData,
  getLegalDisclaimer,
  getTermsAndConditions,
} from "@/services/homepage.service";
import { getAdminFreeProducts } from "@/services/freeProducts.service";
import { DEFAULT_LEGAL_DISCLAIMER, DEFAULT_TERMS_AND_CONDITIONS } from "@/lib/legal-content";
import type { LegalPageContent } from "@/types/api";

export default async function AdminHomepagePage() {
  const [homepageRes, productsRes, termsRes, legalDisclaimerRes] = await Promise.all([
    getHomepageData(),
    getAdminFreeProducts(1, 100),
    getTermsAndConditions(),
    getLegalDisclaimer(),
  ]);
  if (!homepageRes.success) throw new Error(homepageRes.message);
  if (!productsRes.success) throw new Error(productsRes.message);

  const { caseNumber, testimonialsCount, registrarsCount, contactEmail, contactPhone, youtubeLinks } =
    homepageRes.data;

  // Nothing saved yet -> pre-fill the editor with the copy that used to be hardcoded on
  // the public page, so the admin can review and save it in one click instead of starting blank.
  const terms: LegalPageContent =
    termsRes.success && termsRes.data.content
      ? termsRes.data
      : { content: DEFAULT_TERMS_AND_CONDITIONS, updatedAt: null };
  const legalDisclaimer: LegalPageContent =
    legalDisclaimerRes.success && legalDisclaimerRes.data.content
      ? legalDisclaimerRes.data
      : { content: DEFAULT_LEGAL_DISCLAIMER, updatedAt: null };

  return (
    <section>
      <AdminHomepageHero />
      <AdminHomepageTabs
        caseNumber={caseNumber}
        testimonialsCount={testimonialsCount}
        registrarsCount={registrarsCount}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        youtubeLinks={youtubeLinks}
        freeProducts={productsRes.data.items}
        terms={terms}
        legalDisclaimer={legalDisclaimer}
      />
    </section>
  );
}
