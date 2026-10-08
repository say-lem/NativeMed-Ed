import type { CatalogProduct } from "@/types/api";

export function productKey(product: CatalogProduct): string {
  return product.type === "case_bank" ? "case_bank" : `${product.type}:${product._id}`;
}

/** Sample without replacement, excluding the product currently being viewed. */
export function recommendProducts(
  products: CatalogProduct[],
  excludeKey: string,
  limit: number,
): CatalogProduct[] {
  const candidates = products.filter((product) => productKey(product) !== excludeKey);
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, Math.max(0, limit));
}
