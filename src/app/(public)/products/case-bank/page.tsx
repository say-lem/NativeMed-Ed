import axios from "axios";
// import CountDownToClass from "@/components/shared/Countdown";
import ContainedImage from "@/components/shared/ContainedImage";
import { Markdown } from "@/components/shared/Markdown";
import CatalogGrid from "../_components/CatalogGrid";
import TitleCase from "@/components/shared/TitleCase";
import { getCatalog } from "@/services/catalog.service";
import { getCaseBankOverview } from "@/services/cases.service";
import { getCaseBankStatus } from "@/services/subscriptions.service";
import { getOptionalUser } from "@/lib/current-user";
import { roundDownToNearestTen } from "@/lib/stats";
import CaseBankActions from "./_components/CaseBankActions";
import type { CatalogCaseBankProduct } from "@/types/api";

async function loadCaseBank(): Promise<CatalogCaseBankProduct | null> {
  try {
    const res = await getCatalog();
    if (!res.success) return null;
    return (res.data.find((p) => p.type === "case_bank") as CatalogCaseBankProduct) ?? null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[case-bank-detail] fetch error:", err.code, err.message);
    return null;
  }
}

/** The catalog listing deliberately omits `detailedDescription` (same split as
 *  courses) — fetch the overview separately for the longer write-up. */
async function loadDetailedDescription(): Promise<string | undefined> {
  try {
    const res = await getCaseBankOverview();
    return res.success ? res.data.detailedDescription : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[case-bank-detail] overview fetch error:", err.code, err.message);
    return undefined;
  }
}

async function loadAccess(isLoggedIn: boolean): Promise<boolean> {
  if (!isLoggedIn) return false;
  try {
    const res = await getCaseBankStatus();
    return res.success && res.data.active;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[case-bank-detail] status error:", err.code, err.message);
    return false;
  }
}

export default async function CaseBankProductPage() {
  const user = await getOptionalUser();
  const isLoggedIn = Boolean(user);

  const [caseBank, hasAccess, detailedDescription] = await Promise.all([
    loadCaseBank(),
    loadAccess(isLoggedIn),
    loadDetailedDescription(),
  ]);

  if (!caseBank) {
    return (
      <section className="px-4 sm:px-8 lg:px-15 py-24 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-black-others">
          Case Bank unavailable
        </h1>
        <p className="text-subtle-text">
          We couldn&apos;t load the Case Bank right now. Please try again in a moment.
        </p>
      </section>
    );
  }

  const priceLabel = caseBank.prices[0]?.label;

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-8 sm:pt-12 lg:pt-20 pb-16 sm:pb-24 lg:pb-36">
        <aside className="px-0 sm:px-4 lg:px-10">
          <div className="authFormBorder rounded-[16px] p-3 sm:p-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 flex flex-col md:flex-row justify-center overflow-x-hidden">
            <aside className="relative w-full md:basis-1/2 aspect-[4/3] bg-gray-from-radial-bg rounded-lg overflow-hidden">
              <ContainedImage
                src={caseBank.imageUrl || "/Images/card image.png"}
                alt={`image of ${caseBank.title}`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </aside>
            <aside className="w-full md:basis-1/2 flex flex-col justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] tracking-[-2%] text-black-others">
                  {caseBank.title}
                </h3>
                <p className="font-light text-sm sm:text-base lg:text-xl leading-[150%] text-[#373737] whitespace-pre-line">
                  {caseBank.description}
                </p>
                <p className="text-sm text-subtle-text">
                  {roundDownToNearestTen(caseBank.caseCount)}+ cases · {priceLabel ?? "—"}
                </p>
              </div>
              <CaseBankActions
                hasAccess={hasAccess}
                isLoggedIn={isLoggedIn}
                priceLabel={priceLabel}
              />
            </aside>
          </div>
        </aside>

        {/* Longer write-up — outside the hero card, shown only when the admin has set one.
            Stored as markdown from the admin's rich-text editor. */}
        {detailedDescription && (
          <aside className="px-0 sm:px-4 lg:px-10 pt-8 sm:pt-10 space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl text-black-others">
              About the Case Bank
            </h2>
            <Markdown className="text-sm sm:text-base lg:text-lg text-[#373737]">
              {detailedDescription}
            </Markdown>
          </aside>
        )}

        <aside className="pt-10 sm:pt-12 lg:pt-16 space-y-6 sm:space-y-8">
          <TitleCase text="You Might Also Like" />
          <div className="px-0 sm:px-4 lg:px-10">
            <CatalogGrid cutBy={4} excludeKey="case_bank" />
          </div>
        </aside>
      </section>
      {/* <CountDownToClass /> */}
    </>
  );
}
