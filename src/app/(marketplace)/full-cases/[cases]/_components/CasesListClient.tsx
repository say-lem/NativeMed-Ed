"use client";
import { useMemo, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import MockHeaderBg from "./MockHeaderBg";
import BackIcon from "./BackSvg";
import DifferentMockCases from "./DifferentMockCases";
import Pagination from "./Pagination";
import type { Case } from "@/types/api";

export default function CasesListClient({
  title,
  parentSlug,
  cases,
  currentPage,
  totalPages,
  showSpecialty,
}: {
  title: string;
  parentSlug: string;
  cases: Case[];
  currentPage: number;
  totalPages: number;
  showSpecialty: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) => {
      return (
        c.title.toLowerCase().includes(q) ||
        c.patientData.name.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q) ||
        String(c.stationNumber).includes(q)
      );
    });
  }, [query, cases]);

  const isSearching = query.trim().length > 0;

  return (
    <>
      <MockHeaderBg>
        <div className="self-start">
          <BackIcon />
        </div>
        <BannerTitleCase text={title} />

        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] text-white border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-5 sm:size-6 text-white" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title} cases...`}
            className="border-0 outline-0 w-full text-sm sm:text-base text-white bg-transparent placeholder:text-[#B7B7B98C]"
          />
        </div>
      </MockHeaderBg>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {isSearching && (
          <p className="text-xs sm:text-sm text-subtle-text mb-3">
            {filtered.length === 0
              ? `No cases match "${query.trim()}" on this page.`
              : `${filtered.length} of ${cases.length} on this page match "${query.trim()}".`}
          </p>
        )}

        <DifferentMockCases
          cases={filtered}
          parentSlug={parentSlug}
          showSpecialty={showSpecialty}
        />

        {!isSearching && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/full-cases/${parentSlug}`}
          />
        )}
      </div>
    </>
  );
}
