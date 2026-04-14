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
      <section className="px-4 md:px-15 radialBgGradient pt-12 md:pt-20 pb-36">
        <aside className="px-10">
          <div className="authFormBorder rounded-[16px] p-4 gap-5 flex justify-center overflow-x-hidden">
            <aside className="relative basis-1/2 min-h-[60vh]">
              <Image
                src={card.img}
                alt={`image of ${card.title}`}
                fill
                className="object-cover rounded-lg"
              />
              <p className="absolute rounded-[100px] py-2 px-3 top-2 right-5 bg-[rgba(0, 0, 0, 0.5)] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
                {card.tag}
              </p>
            </aside>
            <aside className="basis-1/2 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-semibold text-2xl leading-[130%] tracking-[-2%] text-black-others">
                  MRCGP SCA Revision
                </h3>
                <h4 className="font-semibold text-4xl leading-[130%] tracking-[-2%] text-black-others">
                  £{card.price.toFixed(2)}
                  <span className="text-lg leading-[120%]">/month</span>
                </h4>
                <p className="font-light text-xl leading-[150%] text-[rgba(55, 55, 55, 1)]">
                  Prepare effectively for the MRCGP Simulated Consultation
                  Assessment (SCA) with our Online Monthly Subscription.
                </p>
              </div>
              <div className="flex gap-4 items-center justify-end">
                <Button
                  className="text-black-others font-bold border text-base border-black-others"
                  variant="outline"
                >
                  <span>
                    <AiOutlineShoppingCart className="text-black-others size-5" />
                  </span>
                  <span>Add to Cart</span>
                </Button>
                <Button className="font-bold text-base bg-black-others">
                  Buy Now
                </Button>
              </div>
            </aside>
          </div>
        </aside>
        <aside className="pt-16 space-y-8">
          <TitleCase text="You Might Also Like" />
          <div className="px-10">
            <ProductsCard cutBy={4} />
          </div>
        </aside>
      </section>
      <CountDownToClass />
    </>
  );
}
