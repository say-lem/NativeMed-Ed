import ProductsCard from "@/components/shared/ProductsCard";
import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="px-4 md:px-15 radialBgGradient pt-12 md:pt-20">
      <div className="relative mt-6 md:mt-14 flex items-center justify-center gap-4 md:gap-15 pb-10 md:pb-16 px-1 md:px-3">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-start hidden md:block"
        />

        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl tracking-[-2%] leading-[1.2] md:leading-21.25 text-black-others py-4 md:py-7">
          Our Products
        </h1>
        <Image
          src="/Images/brain tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-end hidden md:block"
        />
      </div>

      <div className="py-10 md:py-20">
        <ProductsCard />
      </div>
    </section>
  );
}
