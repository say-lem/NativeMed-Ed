import ProductsHero from "./_components/Hero";
import type { CatalogProduct } from "@/types/api";
// import CountDownToClass from "@/components/shared/Countdown";

export const metadata = {
  title: "Products",
};

const VALID_TYPES: CatalogProduct["type"][] = [
  "case_bank",
  "live_course",
  "course",
  "one_on_one",
];

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filterType = VALID_TYPES.find((t) => t === type);

  return (
    <>
      <ProductsHero filterType={filterType} />
      {/* <CountDownToClass /> */}
    </>
  );
}
