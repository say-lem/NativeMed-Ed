import axios from "axios";
import MockHeaderBg from "./_components/MockHeaderBg";
import BackIcon from "./_components/BackSvg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import { IoSearchSharp } from "react-icons/io5";
import DifferentMockCases from "./_components/DifferentMockCases";
import Pagination from "./_components/Pagination";
import {
  getAllCases,
  getCasesBySpecialty,
  getSpecialties,
} from "@/services/cases.service";
import { findBySlug } from "@/lib/slug";
import type { CasesPage } from "@/types/api";

const PAGE_LIMIT = 12;

interface PageProps {
  params: Promise<{ cases: string }>;
  searchParams: Promise<{ page?: string }>;
}

interface Resolved {
  title: string;
  page: CasesPage | null;
  showSpecialty: boolean;
  notFound: boolean;
}

async function loadAll(page: number): Promise<CasesPage | null> {
  try {
    const res = await getAllCases(page, PAGE_LIMIT);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[full-cases/all] fetch error:", err.code, err.message);
    } else {
      console.error("[full-cases/all] unexpected error:", err);
    }
    return null;
  }
}

async function loadBySpecialty(
  specialty: string,
  page: number,
): Promise<CasesPage | null> {
  try {
    const res = await getCasesBySpecialty(specialty, page, PAGE_LIMIT);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(
        "[full-cases/specialty] fetch error:",
        err.code,
        err.message,
      );
    } else {
      console.error("[full-cases/specialty] unexpected error:", err);
    }
    return null;
  }
}

async function resolve(slug: string, page: number): Promise<Resolved> {
  if (slug === "all") {
    return {
      title: "All Cases",
      page: await loadAll(page),
      showSpecialty: true,
      notFound: false,
    };
  }

  const specialtiesRes = await getSpecialties();
  if (!specialtiesRes.success) {
    return { title: "", page: null, showSpecialty: false, notFound: false };
  }

  const match = findBySlug(slug, specialtiesRes.data, (s) => s.specialty);
  if (!match) {
    return { title: "", page: null, showSpecialty: false, notFound: true };
  }

  return {
    title: match.specialty,
    page: await loadBySpecialty(match.specialty, page),
    showSpecialty: false,
    notFound: false,
  };
}

export default async function CasesBySpecialtyPage({
  params,
  searchParams,
}: PageProps) {
  const { cases: slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { title, page: data, showSpecialty, notFound } = await resolve(
    slug,
    page,
  );

  if (data?.items[0]) {
    console.log(
      `[full-cases] sample case _id from "${slug}" page ${page}:`,
      data.items[0]._id,
    );
  }

  return (
    <>
      <MockHeaderBg>
        <div className="self-start">
          <BackIcon />
        </div>
        <BannerTitleCase text={title || "Cases"} />

        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] text-[#B7B7B98C] border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-5 sm:size-6 text-white" />
          <input
            type="text"
            placeholder={`Search ${title || ""} cases...`}
            className="border-0 outline-0 w-full text-sm sm:text-base text-white"
          />
        </div>
      </MockHeaderBg>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {notFound ? (
          <p className="text-center text-subtle-text py-12">
            We couldn&apos;t find that specialty. It may have been renamed or
            removed.
          </p>
        ) : !data ? (
          <p className="text-center text-subtle-text py-12">
            We couldn&apos;t load these cases. Please try again in a moment.
          </p>
        ) : (
          <>
            <DifferentMockCases
              cases={data.items}
              parentSlug={slug}
              showSpecialty={showSpecialty}
            />
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              basePath={`/full-cases/${slug}`}
            />
          </>
        )}
      </div>
    </>
  );
}
