import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  Faq,
  FaqInput,
  HomepageData,
  HomepageSettings,
  LegalPageContent,
  UpdateHomepageStatsInput,
  YoutubeLinkInput,
} from "@/types/api";

/** GET /homepage — public. Backs the home page stats + featured videos. */
export async function getHomepageData(): Promise<ApiResponse<HomepageData>> {
  const res = await api.get<ApiResponse<HomepageData>>("/homepage");
  return res.data;
}

/** PATCH /admin/homepage — admin. testimonialsCount/registrarsCount only; caseNumber is derived. */
export async function updateHomepageStats(
  input: UpdateHomepageStatsInput,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.patch<ApiResponse<HomepageSettings>>("/admin/homepage", input);
  return res.data;
}

/** POST /admin/homepage/youtube-links — admin. */
export async function addYoutubeLink(
  input: YoutubeLinkInput,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.post<ApiResponse<HomepageSettings>>(
    "/admin/homepage/youtube-links",
    input,
  );
  return res.data;
}

/** PATCH /admin/homepage/youtube-links/:linkId — admin. Partial; at least one field. */
export async function updateYoutubeLink(
  linkId: string,
  input: Partial<YoutubeLinkInput>,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.patch<ApiResponse<HomepageSettings>>(
    `/admin/homepage/youtube-links/${linkId}`,
    input,
  );
  return res.data;
}

/** DELETE /admin/homepage/youtube-links/:linkId — admin. */
export async function deleteYoutubeLink(
  linkId: string,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.delete<ApiResponse<HomepageSettings>>(
    `/admin/homepage/youtube-links/${linkId}`,
  );
  return res.data;
}

/** GET /homepage/terms — public. Backs /terms-and-conditions and the admin editor. */
export async function getTermsAndConditions(): Promise<ApiResponse<LegalPageContent>> {
  const res = await api.get<ApiResponse<LegalPageContent>>("/homepage/terms");
  return res.data;
}

/** PATCH /admin/homepage/terms — admin. First call creates it, later ones edit in place. */
export async function updateTermsAndConditions(
  content: string,
): Promise<ApiResponse<LegalPageContent>> {
  const res = await api.patch<ApiResponse<LegalPageContent>>("/admin/homepage/terms", {
    content,
  });
  return res.data;
}

/** GET /homepage/legal-disclaimer — public. Backs /legal-disclaimer and the admin editor. */
export async function getLegalDisclaimer(): Promise<ApiResponse<LegalPageContent>> {
  const res = await api.get<ApiResponse<LegalPageContent>>("/homepage/legal-disclaimer");
  return res.data;
}

/** PATCH /admin/homepage/legal-disclaimer — admin. Same create-on-first-save pattern as terms. */
export async function updateLegalDisclaimer(
  content: string,
): Promise<ApiResponse<LegalPageContent>> {
  const res = await api.patch<ApiResponse<LegalPageContent>>(
    "/admin/homepage/legal-disclaimer",
    { content },
  );
  return res.data;
}

/** GET /homepage/faqs — public. Sorted by `order`. No separate admin GET — the admin editor
 *  reads this same list. */
export async function getFaqs(): Promise<ApiResponse<Faq[]>> {
  const res = await api.get<ApiResponse<Faq[]>>("/homepage/faqs");
  return res.data;
}

/** POST /admin/homepage/faqs — admin. Returns the full settings document (same as
 *  youtube-links), not just the new FAQ. */
export async function addFaq(input: FaqInput): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.post<ApiResponse<HomepageSettings>>("/admin/homepage/faqs", input);
  return res.data;
}

/** PATCH /admin/homepage/faqs/:faqId — admin. Partial; at least one field. */
export async function updateFaq(
  faqId: string,
  input: FaqInput,
): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.patch<ApiResponse<HomepageSettings>>(
    `/admin/homepage/faqs/${faqId}`,
    input,
  );
  return res.data;
}

/** DELETE /admin/homepage/faqs/:faqId — admin. */
export async function deleteFaq(faqId: string): Promise<ApiResponse<HomepageSettings>> {
  const res = await api.delete<ApiResponse<HomepageSettings>>(`/admin/homepage/faqs/${faqId}`);
  return res.data;
}
