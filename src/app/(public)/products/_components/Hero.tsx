import ProductsCard from "@/components/shared/ProductsCard";
import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-8 sm:pt-12 lg:pt-20">
      <div className="relative mt-4 sm:mt-6 lg:mt-14 flex items-center justify-center gap-4 sm:gap-8 lg:gap-15 pb-6 sm:pb-10 lg:pb-16 px-1 sm:px-2 lg:px-3">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-start hidden lg:block"
        />

        <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-2%] leading-[1.2] lg:leading-21.25 text-black-others py-3 sm:py-4 lg:py-7">
          Our Products
        </h1>
        <Image
          src="/Images/brain tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-end hidden lg:block"
        />
      </div>

      <div className="py-6 sm:py-10 lg:py-20">
        <ProductsCard />
      </div>
    </section>
  );
}
