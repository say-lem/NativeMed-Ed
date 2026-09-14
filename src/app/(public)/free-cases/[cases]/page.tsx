import axios from "axios";
import MockHeaderBg from "@/app/(marketplace)/full-cases/[cases]/_components/MockHeaderBg";
import BackIcon from "@/app/(marketplace)/full-cases/[cases]/_components/BackSvg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import CasesListClient from "@/app/(marketplace)/full-cases/[cases]/_components/CasesListClient";
import {
  getAllCases,
  getCasesBySpecialty,
  getSpecialties,
} from "@/services/cases.service";
import { findBySlug } from "@/lib/slug";
import type { CasesPage } from "@/types/api";

const PAGE_LIMIT = 12;
const ROOT_PATH = "/free-cases";

interface PageProps {
  params: Promise<{ cases: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

interface Resolved {
  title: string;
  page: CasesPage | null;
  showSpecialty: boolean;
  notFound: boolean;
}

async function loadAll(page: number, search?: string): Promise<CasesPage | null> {
  try {
    const res = await getAllCases(page, PAGE_LIMIT, search);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[free-cases/all] fetch error:", err.code, err.message);
    } else {
      console.error("[free-cases/all] unexpected error:", err);
    }
    return null;
  }
}

async function loadBySpecialty(
  specialty: string,
  page: number,
  search?: string,
): Promise<CasesPage | null> {
  try {
    const res = await getCasesBySpecialty(specialty, page, PAGE_LIMIT, search);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[free-cases/specialty] fetch error:", err.code, err.message);
    } else {
      console.error("[free-cases/specialty] unexpected error:", err);
    }
    return null;
  }
}

async function resolve(slug: string, page: number, search?: string): Promise<Resolved> {
  if (slug === "all") {
    return {
      title: "All Cases",
      page: await loadAll(page, search),
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
    page: await loadBySpecialty(match.specialty, page, search),
    showSpecialty: false,
    notFound: false,
  };
}

export default async function PublicCasesBySpecialtyPage({
  params,
  searchParams,
}: PageProps) {
  const { cases: slug } = await params;
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = (searchParam ?? "").trim();

  const { title, page: data, showSpecialty, notFound } = await resolve(
    slug,
    page,
    search,
  );

  if (notFound || !data) {
    return (
      <>
        <MockHeaderBg>
          <div className="self-start">
            <BackIcon />
          </div>
          <BannerTitleCase text={title || "Cases"} />
        </MockHeaderBg>
        <div className="px-4 sm:px-6 lg:px-8 py-12 text-center text-subtle-text">
          {notFound
            ? "We couldn't find that specialty. It may have been renamed or removed."
            : "We couldn't load these cases. Please try again in a moment."}
        </div>
      </>
    );
  }

  return (
    <CasesListClient
      title={title}
      parentSlug={slug}
      cases={data.items}
      currentPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.total}
      showSpecialty={showSpecialty}
      initialSearch={search}
      rootPath={ROOT_PATH}
    />
  );
}
