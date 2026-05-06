export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findBySlug<T>(
  slug: string,
  candidates: T[],
  getName: (item: T) => string,
): T | undefined {
  return candidates.find((item) => slugify(getName(item)) === slug);
}
