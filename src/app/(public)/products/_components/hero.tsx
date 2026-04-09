import ProductsCard from "@/components/shared/productsCard";
import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="px-15 radialBgGradient pt-20">
      <div className="relative mt-14 flex items-center justify-center gap-15 pb-16 px-3">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-start"
        />

        <h1 className="text-center font-semibold text-7xl tracking-[-2%] leading-21.25 text-blackOthers py-7">
          Our Products
        </h1>
        <Image
          src="/Images/brain tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-end"
        />
      </div>

      <div className="py-20">
        <ProductsCard />
      </div>
    </section>
  );
}
