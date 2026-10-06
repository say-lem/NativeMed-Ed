import axios from "axios";
import Link from "next/link";
import ContainedImage from "./ContainedImage";
import TitleCase from "./TitleCase";
import { getCatalog } from "@/services/catalog.service";
import { courseBadgePrice, formatMoney, liveCourseBadgePrice } from "@/lib/price";
import type { CatalogProduct } from "@/types/api";

// Mirrors the public CatalogGrid ordering — case bank first, then live
// courses, then courses, then one-on-one sessions.
const TYPE_PRIORITY: Record<CatalogProduct["type"], number> = {
  case_bank: 0,
  live_course: 1,
  course: 2,
  one_on_one: 3,
};

async function loadProducts(
  excludeType?: CatalogProduct["type"],
  limit = 2,
): Promise<CatalogProduct[]> {
  try {
    const res = await getCatalog();
    if (!res.success) return [];
    const filtered = excludeType
      ? res.data.filter((p) => p.type !== excludeType)
      : res.data;
    const sorted = [...filtered].sort(
      (a, b) => TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type],
    );
    return sorted.slice(0, limit);
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[you-might-also-like] fetch error:", err.code, err.message);
    return [];
  }
}

/** Member-area destination for each product type (not the public `/products/*`
 *  routes — the user is already signed in). */
function productHref(product: CatalogProduct): string {
  switch (product.type) {
    case "course":
      return `/courses/${product._id}`;
    case "live_course":
      return `/live-courses/${product._id}`;
    case "one_on_one":
      return `/one-on-one/${product._id}`;
    case "case_bank":
      return "/full-cases";
  }
}

function productImage(product: CatalogProduct): string {
  if (product.type === "course" || product.type === "live_course") {
    return product.thumbnailUrl || "/Images/coursesImage.png";
  }
  return product.imageUrl || "/Images/coursesImage.png";
}

function productPrice(product: CatalogProduct): string {
  switch (product.type) {
    case "course":
      return courseBadgePrice(product);
    case "live_course":
      return liveCourseBadgePrice(product);
    case "one_on_one":
      return formatMoney(product.price);
    case "case_bank":
      return product.prices[0]?.label ?? "—";
  }
}

function productCta(product: CatalogProduct): string {
  switch (product.type) {
    case "course":
    case "live_course":
      return "View course";
    case "one_on_one":
      return "Book a session";
    case "case_bank":
      return "View case bank";
  }
}

export default async function YouMightAlsoLike({
  excludeType,
  limit = 2,
}: {
  /** Pass the type of product the current page already shows (e.g. "course"
   *  on the courses list) so recommendations don't just repeat it. */
  excludeType?: CatalogProduct["type"];
  limit?: number;
}) {
  const products = await loadProducts(excludeType, limit);
  if (products.length === 0) return null;

  return (
    <section className="py-12 px-4 lg:px-8 space-y-4">
      <TitleCase text="You Might Also Like" />

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.type === "case_bank" ? "case_bank" : product._id}
            className="rounded-[16px] p-1 bg-[#FFFFFF] alsoLikeBorder flex flex-col md:flex-row gap-6"
          >
            <aside className="relative w-full md:basis-1/4 aspect-[4/3] md:self-start rounded-[8px] overflow-hidden bg-gray-from-radial-bg">
              <ContainedImage
                src={productImage(product)}
                alt={`image of ${product.title}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </aside>

            <aside className="w-full md:basis-3/4 flex flex-col gap-4 py-4 px-6 justify-between sm:gap-6">
              <h3 className="font-semibold text-lg sm:text-xl leading-[130%] tracking-[-2%] text-black-others line-clamp-2">
                {product.title}
              </h3>
              {product.description && (
                <p className="font-light text-sm sm:text-base leading-[150%] text-[#373737] line-clamp-3">
                  {product.description}
                </p>
              )}

              <div className="flex justify-between items-center gap-3">
                <span className="font-bold text-sm text-black-others">
                  {productPrice(product)}
                </span>
                <Link
                  href={productHref(product)}
                  className="rounded-[8px] bg-black-others text-white font-bold text-sm px-5 py-2.5 hover:bg-black/85"
                >
                  {productCta(product)}
                </Link>
              </div>
            </aside>
          </div>
        ))}
      </div>
    </section>
  );
}
