import axios from "axios";
import { Markdown } from "@/components/shared/Markdown";
import { formatDate } from "@/lib/date";
import { DEFAULT_TERMS_AND_CONDITIONS } from "@/lib/legal-content";
import { getTermsAndConditions } from "@/services/homepage.service";

export const metadata = {
  title: "Terms & Conditions",
};

async function loadTerms(): Promise<{ content: string; updatedAt: string | null }> {
  try {
    const res = await getTermsAndConditions();
    if (res.success && res.data.content) return res.data;
    return { content: DEFAULT_TERMS_AND_CONDITIONS, updatedAt: null };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return { content: DEFAULT_TERMS_AND_CONDITIONS, updatedAt: null };
  }
}

export default async function TermsAndConditions() {
  const { content, updatedAt } = await loadTerms();

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16 flex items-center justify-center">
        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2%] leading-[1.2] text-primary-100">
          Terms & Conditions
        </h1>
      </section>

      <section className="px-4 sm:px-8 md:px-10 lg:px-15 py-8 sm:py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          {updatedAt && (
            <p className="text-xs text-subtle-text mb-4">Last updated {formatDate(updatedAt)}</p>
          )}
          <Markdown className="text-xs sm:text-sm md:text-base lg:text-lg leading-[150%] text-subtle-text font-light">
            {content}
          </Markdown>
        </div>
      </section>
    </>
  );
}
