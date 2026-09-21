import AdminHomepageHero from "./_components/AdminHomepageHero";
import AdminHomepageTabs from "./_components/AdminHomepageTabs";
import {
  getFaqs,
  getFounderBio,
  getHomepageData,
  getLegalDisclaimer,
  getPrivacyPolicy,
  getTermsAndConditions,
} from "@/services/homepage.service";
import { getAdminFreeProducts } from "@/services/freeProducts.service";
import {
  DEFAULT_FOUNDER_BIO,
  DEFAULT_FOUNDER_TITLE,
  DEFAULT_LEGAL_DISCLAIMER,
  DEFAULT_PRIVACY_POLICY,
  DEFAULT_TERMS_AND_CONDITIONS,
} from "@/lib/legal-content";
import type { FounderBioContent, LegalPageContent } from "@/types/api";

export default async function AdminHomepagePage() {
  const [
    homepageRes,
    productsRes,
    termsRes,
    legalDisclaimerRes,
    privacyPolicyRes,
    faqsRes,
    founderBioRes,
  ] = await Promise.all([
    getHomepageData(),
    getAdminFreeProducts(1, 100),
    getTermsAndConditions(),
    getLegalDisclaimer(),
    getPrivacyPolicy(),
    getFaqs(),
    getFounderBio(),
  ]);
  if (!homepageRes.success) throw new Error(homepageRes.message);
  if (!productsRes.success) throw new Error(productsRes.message);

  const {
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
  } = homepageRes.data;
  const faqs = faqsRes.success ? faqsRes.data : [];

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
  const privacyPolicy: LegalPageContent =
    privacyPolicyRes.success && privacyPolicyRes.data.content
      ? privacyPolicyRes.data
      : { content: DEFAULT_PRIVACY_POLICY, updatedAt: null };
  // content/title fall back independently — an admin may have set one before the other
  // existed (or set the photo without touching either field yet).
  const founderBio: FounderBioContent = founderBioRes.success
    ? {
        content: founderBioRes.data.content || DEFAULT_FOUNDER_BIO,
        title: founderBioRes.data.title || DEFAULT_FOUNDER_TITLE,
        imageUrl: founderBioRes.data.imageUrl,
        updatedAt: founderBioRes.data.updatedAt,
      }
    : {
        content: DEFAULT_FOUNDER_BIO,
        title: DEFAULT_FOUNDER_TITLE,
        imageUrl: null,
        updatedAt: null,
      };

  return (
    <section>
      <AdminHomepageHero />
      <AdminHomepageTabs
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
        youtubeLinks={youtubeLinks}
        freeProducts={productsRes.data.items}
        terms={terms}
        legalDisclaimer={legalDisclaimer}
        privacyPolicy={privacyPolicy}
        faqs={faqs}
        founderBio={founderBio}
      />
    </section>
  );
}
