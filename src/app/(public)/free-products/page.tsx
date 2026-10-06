import axios from "axios";
import FreeProductsToggle from "./_components/FreeProductsToggle";
import { getAllFreeProducts } from "@/services/freeProducts.service";
import type { FreeProduct } from "@/types/api";

export const metadata = {
  title: "Free Resources | Native Medical Education",
};

async function loadFreeProducts(): Promise<FreeProduct[]> {
  try {
    return await getAllFreeProducts();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[free-products] fetch error:", err.code, err.message);
    } else {
      console.error("[free-products] unexpected error:", err);
    }
    return [];
  }
}

export default async function FreeProductsPage() {
  const products = await loadFreeProducts();
  const blogs = products.filter((p) => p.type === "blog");
  const resources = products.filter((p) => p.type !== "blog");

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16 flex flex-col items-center justify-center gap-3">
        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2%] leading-[1.2] text-primary-100">
          Free Resources
        </h1>
        <p className="text-center text-subtle-text max-w-xl">
          Free resources for MRCGP SCA candidates — no account or payment required.
        </p>
      </section>

      <section className="px-4 sm:px-8 md:px-10 lg:px-15 py-8 sm:py-10 md:py-14">
        <FreeProductsToggle blogs={blogs} resources={resources} />
      </section>
    </>
  );
}
