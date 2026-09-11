import axios from "axios";
import FreeProductCard from "./_components/FreeProductCard";
import PagePagination from "@/components/shared/PagePagination";
import { getFreeProducts } from "@/services/freeProducts.service";
import type { FreeProduct, Paginated } from "@/types/api";

export const metadata = {
  title: "Free Products | Native Medical Education",
};

const PAGE_LIMIT = 12;

async function loadFreeProducts(page: number): Promise<Paginated<FreeProduct> | null> {
  try {
    const res = await getFreeProducts(page, PAGE_LIMIT);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[free-products] fetch error:", err.code, err.message);
    } else {
      console.error("[free-products] unexpected error:", err);
    }
    return null;
  }
}

export default async function FreeProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const data = await loadFreeProducts(page);

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16 flex flex-col items-center justify-center gap-3">
        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2%] leading-[1.2] text-primary-100">
          Free Products
        </h1>
        <p className="text-center text-subtle-text max-w-xl">
          Free resources for MRCGP SCA candidates — no account or payment required.
        </p>
      </section>

      <section className="px-4 sm:px-8 md:px-10 lg:px-15 py-8 sm:py-10 md:py-14">
        {!data || data.items.length === 0 ? (
          <p className="text-center text-subtle-text py-10">
            {data ? "No free products yet — check back soon." : "We couldn't load free products right now."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {data.items.map((product) => (
                <FreeProductCard key={product._id} product={product} />
              ))}
            </div>
            <PagePagination
              currentPage={data.page}
              totalPages={data.totalPages}
              basePath="/free-products"
            />
          </>
        )}
      </section>
    </>
  );
}
