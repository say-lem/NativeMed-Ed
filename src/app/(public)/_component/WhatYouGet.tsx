import ButtonTag from "@/components/shared/buttonTag";
import SubtleText from "./SubtleText";
import Image from "next/image";
import ProductsCard from "@/components/shared/productsCard";
import TitleCase from "@/components/shared/titleCase";

export default function WhatYouGet() {
  return (
    <section className="px-15 pt-24 space-y-12 pb-10">
      <div className="text-center mx-auto w-[50%]">
        <ButtonTag title="Products" />
        <TitleCase text="What You Get" />
        <SubtleText text="From live class recordings to pre-recorded lectures, question banks, and SCA cases—everything you need in one place." />
      </div>

      <ProductsCard cutBy={3} />

      <p className="text-primary100 leading-[150%] font-semibold flex items-center gap-2 justify-end cursor-pointer hover:underline underline-offset-2">
        <span>See more</span>
        <Image
          src={"/Images/arrow-foward-purple.png"}
          alt="arrow forward"
          height={13.33}
          width={13.33}
        />
      </p>
    </section>
  );
}
