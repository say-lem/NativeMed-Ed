"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IoSearchSharp } from "react-icons/io5";
import { Loader2, X } from "lucide-react";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import MockHeaderBg from "./MockHeaderBg";
import BackIcon from "./BackSvg";
import DifferentMockCases from "./DifferentMockCases";
import Pagination from "./Pagination";
import type { Case } from "@/types/api";

const DEBOUNCE_MS = 350;

export default function CasesListClient({
  title,
  parentSlug,
  cases,
  currentPage,
  totalPages,
  totalResults,
  showSpecialty,
  initialSearch,
  rootPath = "/full-cases",
}: {
  title: string;
  parentSlug: string;
  cases: Case[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  showSpecialty: boolean;
  initialSearch: string;
  /** Lets the public case-bank preview reuse this exact page with its own base path. */
  rootPath?: string;
}) {
  const router = useRouter();
  const [input, setInput] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();
  const basePath = `${rootPath}/${parentSlug}`;

  // Tracks the last `initialSearch` we know about, so we can tell "the URL
  // changed because WE pushed/replaced it" apart from "the URL changed
  // because the user hit Back/Forward" (same prop change, different cause).
  const prevInitialSearch = useRef(initialSearch);
  // Whether the current filtered session already has its own history entry
  // — only the empty→non-empty transition should push; further edits while
  // already filtered replace in place instead of stacking one entry per
  // debounce pause.
  const hasPushedRef = useRef(initialSearch !== "");

  // Back/Forward restored a different `search` than what's in the box —
  // resync it instead of letting the effect below immediately push the
  // stale local value right back onto the URL (which is what made Back
  // effectively undo itself).
  useEffect(() => {
    if (initialSearch === prevInitialSearch.current) return;
    prevInitialSearch.current = initialSearch;
    hasPushedRef.current = initialSearch !== "";
    setInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed === initialSearch) return;

    const handler = setTimeout(() => {
      prevInitialSearch.current = trimmed;
      const params = new URLSearchParams();
      if (trimmed) params.set("search", trimmed);
      const url = params.toString() ? `${basePath}?${params}` : basePath;

      if (trimmed && !hasPushedRef.current) {
        hasPushedRef.current = true;
        startTransition(() => router.push(url));
      } else {
        if (!trimmed) hasPushedRef.current = false;
        startTransition(() => router.replace(url));
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [input, initialSearch, basePath, router]);

  const hasSearch = initialSearch.length > 0;
  const showSpinner = isPending || input.trim() !== initialSearch;

  return (
    <>
      <MockHeaderBg>
        <div className="self-start">
          <BackIcon />
        </div>
        <BannerTitleCase text={title} />

        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] text-white border-[#D6D6D64F] items-center">
          {showSpinner ? (
            <Loader2 className="size-5 sm:size-6 text-white animate-spin" />
          ) : (
            <IoSearchSharp className="size-5 sm:size-6 text-white" />
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Search ${title} cases...`}
            className="border-0 outline-0 w-full text-sm sm:text-base text-white bg-transparent placeholder:text-[#B7B7B98C]"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              aria-label="Clear search"
              className="shrink-0 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="size-4 sm:size-5" />
            </button>
          )}
        </div>
      </MockHeaderBg>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {hasSearch && (
          <p className="text-xs sm:text-sm text-subtle-text mb-3">
            {totalResults === 0
              ? `No cases match "${initialSearch}".`
              : `${totalResults} ${totalResults === 1 ? "result" : "results"} for "${initialSearch}"`}
          </p>
        )}

        <DifferentMockCases
          cases={cases}
          parentSlug={parentSlug}
          showSpecialty={showSpecialty}
          rootPath={rootPath}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
          searchQuery={initialSearch}
        />
      </div>
    </>
  );
}
