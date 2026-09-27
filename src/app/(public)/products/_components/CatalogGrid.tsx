import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Layers } from "lucide-react";
import { courseBadgePrice, formatMoney, liveCourseBadgePrice } from "@/lib/price";
import { roundDownToNearestTen } from "@/lib/stats";
import { getCatalog } from "@/services/catalog.service";
import type { CatalogProduct } from "@/types/api";

// Catalogue order (home page preview + full /products grid): case bank first,
// then live courses, then courses, then one-on-one sessions.
const TYPE_PRIORITY: Record<CatalogProduct["type"], number> = {
  case_bank: 0,
  live_course: 1,
  course: 2,
  one_on_one: 3,
};

async function loadCatalog(
  cutBy: number,
  filterType?: CatalogProduct["type"],
): Promise<CatalogProduct[]> {
  try {
    const res = await getCatalog();
    if (!res.success) return [];
    const filtered = filterType
      ? res.data.filter((p) => p.type === filterType)
      : res.data;
    // Stable sort — items of the same type keep their original relative order.
    const sorted = [...filtered].sort(
      (a, b) => TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type],
    );
    return cutBy > 0 ? sorted.slice(0, cutBy) : sorted;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[catalog-grid] fetch error:", err.code, err.message);
    return [];
  }
}

const cardClass =
  "rounded-[16px] border-[0.5px] border-[#F7F4FB] cardShadow space-y-3 sm:space-y-4 lg:space-y-8 overflow-y-hidden pb-3 sm:pb-4 h-full flex flex-col";

function CtaBadge({
  children,
  price,
}: {
  children: React.ReactNode;
  price?: string;
}) {
  return (
    <div className="px-3 sm:px-4 lg:px-6 flex justify-between items-center gap-2">
      <span className="font-bold text-sm sm:text-base text-black-others">
        {price}
      </span>
      <span className="bg-black-others shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)] text-white rounded-md font-bold text-xs sm:text-sm leading-[150%] px-4 py-2">
        {children}
      </span>
    </div>
  );
}

export default async function CatalogGrid({
  cutBy = 0,
  filterType,
}: {
  cutBy?: number;
  filterType?: CatalogProduct["type"];
}) {
  const products = await loadCatalog(cutBy, filterType);

  if (products.length === 0) {
    return (
      <p className="text-center text-subtle-text py-10">
        {filterType
          ? "No products of this type available right now. Check back soon."
          : "No products available right now. Check back soon."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-9">
      {products.map((product) => {
        if (product.type === "course") {
          return (
            <Link href={`/products/${product._id}`} key={product._id}>
              <div role="link" tabIndex={0} className={cardClass}>
                <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64 bg-gray-from-radial-bg">
                  <Image
                    src={product.thumbnailUrl || "/Images/card image.png"}
                    alt={`image of ${product.title}`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <p className="absolute rounded-[100px] py-2 px-3 top-2 right-3 bg-[#00000080] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
                    {courseBadgePrice(product)}
                  </p>
                </aside>

                <aside className="px-3 sm:px-4 lg:px-6 flex-1">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                      {product.title}
                    </p>
                    <p className="line-clamp-3 text-sm leading-[150%] text-[#373737]">
                      {product.description}
                    </p>
                  </div>
                </aside>

                <CtaBadge price={courseBadgePrice(product)}>View Course</CtaBadge>
              </div>
            </Link>
          );
        }

        if (product.type === "live_course") {
          return (
            <Link href={`/products/${product._id}`} key={product._id}>
              <div role="link" tabIndex={0} className={cardClass}>
                <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64 bg-gray-from-radial-bg">
                  <Image
                    src={product.thumbnailUrl || "/Images/card image.png"}
                    alt={`image of ${product.title}`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <p className="absolute rounded-[100px] py-2 px-3 top-2 right-3 bg-[#00000080] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
                    {liveCourseBadgePrice(product)}
                  </p>
                </aside>

                <aside className="px-3 sm:px-4 lg:px-6 flex-1">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                      {product.title}
                    </p>
                    <p className="line-clamp-3 text-sm leading-[150%] text-[#373737]">
                      {product.description}
                    </p>
                  </div>
                </aside>

                <CtaBadge price={liveCourseBadgePrice(product)}>View Course</CtaBadge>
              </div>
            </Link>
          );
        }

        if (product.type === "one_on_one") {
          return (
            <Link href={`/one-on-one/${product._id}`} key={product._id}>
              <div role="link" tabIndex={0} className={cardClass}>
                <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64 bg-gray-from-radial-bg grid place-items-center">
                  <span className="grid place-items-center size-16 rounded-full bg-primary-100 text-white">
                    <CalendarClock size={28} />
                  </span>
                </aside>

                <aside className="px-3 sm:px-4 lg:px-6 flex-1">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                      {product.title}
                    </p>
                    <p className="line-clamp-3 text-sm leading-[150%] text-[#373737]">
                      {product.description}
                    </p>
                  </div>
                </aside>

                <CtaBadge price={formatMoney(product.price)}>Book a Session</CtaBadge>
              </div>
            </Link>
          );
        }

        // case_bank — always exactly one, no _id (not a persisted document)
        return (
          <Link href="/products/case-bank" key="case_bank">
            <div role="link" tabIndex={0} className={cardClass}>
              <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64 bg-gray-from-radial-bg grid place-items-center overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={`image of ${product.title}`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <span className="grid place-items-center size-16 rounded-full bg-primary-100 text-white">
                    <Layers size={28} />
                  </span>
                )}
              </aside>

              <aside className="px-3 sm:px-4 lg:px-6 flex-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                    {product.title}
                  </p>
                  <p className="line-clamp-3 text-sm leading-[150%] text-[#373737]">
                    {product.description}
                  </p>
                  <p className="text-xs text-subtle-text">
                    {roundDownToNearestTen(product.caseCount)}+ cases
                  </p>
                </div>
              </aside>

              <CtaBadge price={product.prices[0]?.label ?? "—"}>See Details</CtaBadge>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
