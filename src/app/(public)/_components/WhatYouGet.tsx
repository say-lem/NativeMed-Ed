import ButtonTag from "@/components/shared/ButtonTag";
import SubtleText from "@/components/shared/SubtleText";
import Image from "next/image";
import ProductsCard from "@/components/shared/ProductsCard";
import TitleCase from "@/components/shared/TitleCase";

export default function WhatYouGet() {
  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-18 lg:pt-24 space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12 pb-8 sm:pb-10">
      <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%]">
        <ButtonTag title="Products" />
        <TitleCase text="What You Get" />
        <SubtleText text="From live class recordings to pre-recorded lectures, question banks, and SCA cases—everything you need in one place." />
      </div>

      <ProductsCard cutBy={3} />

      <p className="text-primary-100 leading-[150%] font-semibold flex items-center gap-2 justify-end cursor-pointer hover:underline underline-offset-2">
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
