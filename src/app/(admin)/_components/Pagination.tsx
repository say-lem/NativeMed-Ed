"use client";

import { useAdminList } from "./AdminListContext";
import { pageNumbers } from "@/lib/pagination";

const btn =
  "min-w-9 h-9 px-3 rounded-[6px] border text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
const idle = "border-[#E0E0E0] text-black-others hover:bg-gray-100";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const { page, setPage } = useAdminList();
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);
  const pages = pageNumbers(current, totalPages);

  // The list is client-side sliced (no navigation), so nothing scrolls the user
  // back up on a page change — do it explicitly so they start at the top.
  const goTo = (p: number) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2 flex-wrap"
    >
      <button
        type="button"
        onClick={() => goTo(current - 1)}
        disabled={current <= 1}
        className={`${btn} ${idle}`}
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="min-w-9 h-9 grid place-items-center text-subtle-text select-none"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p)}
            aria-current={p === current ? "page" : undefined}
            className={`${btn} ${
              p === current
                ? "bg-[#2D135C] text-white border-[#2D135C]"
                : idle
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        disabled={current >= totalPages}
        className={`${btn} ${idle}`}
      >
        Next
      </button>
    </nav>
  );
}
