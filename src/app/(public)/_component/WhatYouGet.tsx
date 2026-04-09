import ButtonTag from "@/components/shared/buttonTag";
import SubtleText from "./SubtleText";
import Image from "next/image";
import ProductsCard from "@/components/shared/productsCard";

export default function WhatYouGet() {
  return (
    <section className="px-15 pt-24 space-y-12 pb-10">
      <div className="text-center mx-auto w-[50%]">
        <ButtonTag title="Products" />
        <h2 className="font-semibold text-4xl leading-[120%] tracking-[-2%] text-blackOthers mt-3">
          What You Get
        </h2>
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
