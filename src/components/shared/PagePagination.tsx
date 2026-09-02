import Link from "next/link";
import { pageNumbers } from "@/lib/pagination";

const baseBtn =
  "h-9 min-w-9 px-3 inline-flex items-center justify-center rounded-md text-sm border";
const activeBtn = "bg-primary-100 text-white border-primary-100";
const inactiveBtn =
  "border-gray-2 text-black-others hover:bg-primary-10 hover:border-primary-100";
const disabledBtn = "border-gray-2 text-gray-2 pointer-events-none";

/** Link-based pager for public list pages (e.g. /reviews, /events) — plain `?page=` param. */
export default function PagePagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const linkFor = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const pages = pageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-6 sm:py-8"
    >
      <Link
        href={prevDisabled ? "#" : linkFor(currentPage - 1)}
        aria-disabled={prevDisabled}
        tabIndex={prevDisabled ? -1 : undefined}
        className={`${baseBtn} ${prevDisabled ? disabledBtn : inactiveBtn}`}
      >
        Prev
      </Link>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="px-1 text-subtle-text select-none"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={linkFor(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`${baseBtn} ${p === currentPage ? activeBtn : inactiveBtn}`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={nextDisabled ? "#" : linkFor(currentPage + 1)}
        aria-disabled={nextDisabled}
        tabIndex={nextDisabled ? -1 : undefined}
        className={`${baseBtn} ${nextDisabled ? disabledBtn : inactiveBtn}`}
      >
        Next
      </Link>
    </nav>
  );
}
