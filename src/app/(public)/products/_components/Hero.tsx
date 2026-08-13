import ProductsCard from "@/components/shared/ProductsCard";
import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-8 sm:pt-10 lg:pt-14 pb-10 sm:pb-14 md:pb-16 lg:pb-20">
      <div className="relative mt-2 sm:mt-4 lg:mt-6 flex items-center justify-center gap-4 sm:gap-8 lg:gap-15 pb-4 sm:pb-6 lg:pb-8 px-1 sm:px-2 lg:px-3">
        <Image
          src="/Images/dna tile.png"
          alt=""
          aria-hidden
          width={50}
          height={50}
          className="self-start hidden lg:block"
        />

        {/* No `lg:leading-21.25` — that's an 85px line-height, which on this 48px heading
            added ~37px of dead space above and below the words. */}
        <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-2%] leading-[1.2] text-black-others py-2">
          Our Products
        </h1>
        <Image
          src="/Images/brain tile.png"
          alt=""
          aria-hidden
          width={50}
          height={50}
          className="self-end hidden lg:block"
        />
      </div>

      <div className="pt-2 sm:pt-4 lg:pt-6">
        <ProductsCard />
      </div>
    </section>
  );
}
