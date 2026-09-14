"use client";
import { useMemo, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "../../_components/BannerBg";
import MockCasesCards from "./MockBankCards";
import CaseBankUpsell from "./CaseBankUpsell";
import type { Specialty } from "@/types/api";

export default function SpecialtyBankClient({
  specialties,
  upsellPriceLabel = null,
  rootPath = "/full-cases",
  notice,
}: {
  specialties: Specialty[];
  upsellPriceLabel?: string | null;
  /** Lets the public case-bank preview reuse this exact page with its own base path. */
  rootPath?: string;
  /** Overrides the built-in "subscribe" upsell — used by the public preview, which
   *  shows a different message depending on whether the visitor already has access. */
  notice?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");

  const totalCases = useMemo(
    () => specialties.reduce((sum, s) => sum + s.count, 0),
    [specialties],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return specialties;
    return specialties.filter((s) => s.specialty.toLowerCase().includes(q));
  }, [query, specialties]);

  const isSearching = query.trim().length > 0;

  return (
    <section>
      <BannerBg color={"#2D135C"}>
        <BannerTitleCase text="Case Bank" />
        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] text-white border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-5 sm:size-6 text-white" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search specialties..."
            className="border-0 outline-0 w-full text-sm sm:text-base bg-transparent placeholder:text-[#B7B7B98C]"
          />
        </div>
      </BannerBg>

      {notice ??
        (upsellPriceLabel !== null && (
          <CaseBankUpsell priceLabel={upsellPriceLabel || undefined} />
        ))}

      <div className="px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-6 sm:py-8">
        <MockCasesCards
          specialties={filtered}
          totalCases={totalCases}
          rootPath={rootPath}
          emptyMessage={
            isSearching
              ? `No specialties match "${query.trim()}".`
              : undefined
          }
        />
      </div>
    </section>
  );
}
