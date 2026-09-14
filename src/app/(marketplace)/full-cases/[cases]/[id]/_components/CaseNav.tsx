import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCases, getCasesBySpecialty } from "@/services/cases.service";
import type { Case } from "@/types/api";

const WINDOW = 50; // backend caps `limit` at 50

/**
 * Previous / next case within the current browsing context (a specialty, or
 * "all"). Neighbours are found in the ordered list; if a neighbour falls outside
 * the fetched window (e.g. a high station in the full 251-case bank) its button
 * is simply hidden — never a broken link. For full coverage across a large "all"
 * list, the backend would need an "adjacent case" endpoint.
 */
async function loadNeighbors(
  slug: string,
  currentId: string,
  specialty: string,
): Promise<{ prev: Case | null; next: Case | null }> {
  const empty = { prev: null, next: null };
  try {
    const res =
      slug === "all"
        ? await getAllCases(1, WINDOW)
        : await getCasesBySpecialty(specialty, 1, WINDOW);
    if (!res.success) return empty;

    const items = res.data.items;
    const idx = items.findIndex((c) => c._id === currentId);
    if (idx === -1) return empty;

    return {
      prev: idx > 0 ? items[idx - 1] : null,
      next: idx < items.length - 1 ? items[idx + 1] : null,
    };
  } catch {
    return empty;
  }
}

export default async function CaseNav({
  slug,
  currentId,
  specialty,
  rootPath = "/full-cases",
}: {
  slug: string;
  currentId: string;
  specialty: string;
  /** Lets the public case-bank preview reuse this exact nav with its own base path. */
  rootPath?: string;
}) {
  const { prev, next } = await loadNeighbors(slug, currentId, specialty);
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Case navigation"
      className="px-4 sm:px-6 lg:px-8 pb-10 pt-2 flex items-stretch justify-between gap-3"
    >
      {prev ? (
        <Link
          href={`${rootPath}/${slug}/${prev._id}`}
          className="group flex-1 max-w-[48%] rounded-[12px] border border-gray-2 px-4 py-3 hover:border-primary-100 hover:bg-primary-10 transition-colors"
        >
          <span className="flex items-center gap-1 text-xs text-subtle-text">
            <ChevronLeft size={14} /> Previous
          </span>
          <span className="mt-1 block text-sm font-medium text-black-others truncate">
            Station {prev.stationNumber}: {prev.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1 max-w-[48%]" />
      )}

      {next ? (
        <Link
          href={`${rootPath}/${slug}/${next._id}`}
          className="group flex-1 max-w-[48%] rounded-[12px] border border-gray-2 px-4 py-3 text-right hover:border-primary-100 hover:bg-primary-10 transition-colors"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-subtle-text">
            Next <ChevronRight size={14} />
          </span>
          <span className="mt-1 block text-sm font-medium text-black-others truncate">
            Station {next.stationNumber}: {next.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1 max-w-[48%]" />
      )}
    </nav>
  );
}
