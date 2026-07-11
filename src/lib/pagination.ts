export type PageItem = number | "ellipsis";

/**
 * Build a truncated list of page numbers for a pager: always the first page,
 * the last page, the active page, and a window of pages around the active one,
 * with `"ellipsis"` markers standing in for the hidden gaps.
 *
 * Shows at most `maxNumbers` actual page numbers (default 15). When the total
 * fits, every page is returned.
 */
export function pageNumbers(
  current: number,
  total: number,
  maxNumbers = 15,
): PageItem[] {
  if (total <= 1) return [1];
  if (total <= maxNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const clamped = Math.min(Math.max(current, 1), total);

  // Reserve two slots for the first + last page; the rest is the middle window.
  const windowSize = maxNumbers - 2;
  let start = clamped - Math.floor((windowSize - 1) / 2);
  let end = clamped + Math.ceil((windowSize - 1) / 2);

  if (start < 2) {
    start = 2;
    end = start + windowSize - 1;
  }
  if (end > total - 1) {
    end = total - 1;
    start = end - windowSize + 1;
  }
  if (start < 2) start = 2;

  const out: PageItem[] = [1];

  if (start > 2) out.push("ellipsis");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("ellipsis");

  out.push(total);
  return out;
}
