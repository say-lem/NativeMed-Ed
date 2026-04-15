import CountDownToClass from "@/components/shared/Countdown";

import ProductsCard from "@/components/shared/ProductsCard";
import TitleCase from "@/components/shared/TitleCase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { use } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function ProductByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  console.log(id); //To be used for the get request

  //   mock data
  const card = {
    id: 4,
    tag: "Subscription",
    img: "/Images/card image.png",
    title: "1-on-1 Sessions with Dr Native (6 Cases)",
    desc: "Our Flagship Extensive Course is a 4-5 week intensive program. designed to equip you with the knowledge, skills, and confidence to excel in the MRCGP SCA exam.",
    price: 199,
  };
  return (
    <>
      {" "}
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-8 sm:pt-12 lg:pt-20 pb-16 sm:pb-24 lg:pb-36">
        <aside className="px-0 sm:px-4 lg:px-10">
          <div className="authFormBorder rounded-[16px] p-3 sm:p-4 gap-4 sm:gap-5 flex flex-col md:flex-row justify-center overflow-x-hidden">
            <aside className="relative w-full md:basis-1/2 min-h-[35vh] sm:min-h-[40vh] md:min-h-[50vh] lg:min-h-[60vh]">
              <Image
                src={card.img}
                alt={`image of ${card.title}`}
                fill
                className="object-cover object-center rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <p className="absolute rounded-[100px] py-2 px-3 top-2 right-5 bg-[rgba(0, 0, 0, 0.5)] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
                {card.tag}
              </p>
            </aside>
            <aside className="w-full md:basis-1/2 flex flex-col justify-between gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] tracking-[-2%] text-black-others">
                  MRCGP SCA Revision
                </h3>
                <h4 className="font-semibold text-2xl sm:text-3xl lg:text-4xl leading-[130%] tracking-[-2%] text-black-others">
                  £{card.price.toFixed(2)}
                  <span className="text-base sm:text-lg leading-[120%]">/month</span>
                </h4>
                <p className="font-light text-sm sm:text-base lg:text-xl leading-[150%] text-[rgba(55, 55, 55, 1)]">
                  Prepare effectively for the MRCGP Simulated Consultation
                  Assessment (SCA) with our Online Monthly Subscription.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-end">
                <Button
                  className="text-black-others font-bold border text-sm sm:text-base border-black-others"
                  variant="outline"
                >
                  <span>
                    <AiOutlineShoppingCart className="text-black-others size-4 sm:size-5" />
                  </span>
                  <span>Add to Cart</span>
                </Button>
                <Button className="font-bold text-sm sm:text-base bg-black-others">
                  Buy Now
                </Button>
              </div>
            </aside>
          </div>
        </aside>
        <aside className="pt-10 sm:pt-12 lg:pt-16 space-y-6 sm:space-y-8">
          <TitleCase text="You Might Also Like" />
          <div className="px-0 sm:px-4 lg:px-10">
            <ProductsCard cutBy={4} />
          </div>
        </aside>
      </section>
      <CountDownToClass />
    </>
  );
}
