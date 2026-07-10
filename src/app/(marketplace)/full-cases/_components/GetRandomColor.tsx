const pageHeaderColors = [
  "#992E6C",
  "#2368B6",
  "#906C00",
  "#D07910",
  "#19A535",
  "#0796A9",
  "#4425B3",
  "#721616",
];

/**
 * Deterministic header color from a stable seed (e.g. a case id or title).
 * Must be deterministic — a random pick differs between server render and client
 * hydration, which triggers a React hydration mismatch.
 */
export function colorFromSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return pageHeaderColors[Math.abs(hash) % pageHeaderColors.length];
}
