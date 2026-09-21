/** "247" -> "250", "244" -> "240" — used for the live case count so it reads as a round figure. */
export function roundToNearestTen(n: number): number {
  return Math.round(n / 10) * 10;
}

/** "247" -> "240" — for "X+ cases" labels, so the "+" never overstates the live count
 *  (rounding to nearest could round 259 up to "260+", which is a lie). */
export function roundDownToNearestTen(n: number): number {
  return Math.floor(n / 10) * 10;
}

/** "247" -> "247+", "3000" -> "3k+", "3200" -> "3.2k+" — matches the homepage stat style. */
export function formatStatCount(n: number): string {
  if (n >= 1000) {
    const thousands = Math.floor((n / 1000) * 10) / 10;
    return `${thousands}k+`;
  }
  return `${n}+`;
}
