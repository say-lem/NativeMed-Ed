import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ProductsCard({ cutBy = 0 }: { cutBy?: number }) {
  const card = [
    {
      id: 1,
      tag: "Popular",
      img: "/Images/card image.png",
      title: "MRCGP SCA Revision",
      desc: "Get access to over 150 comprehensive practice cases for just 19.99 per month",
      price: 199,
    },
    {
      id: 2,
      tag: "Course",
      img: "/Images/card image.png",
      title: "Native MRCGP SCA Extensive Course",
      desc: "Our Flagship Extensive Course is a 4-5 week intensive program. designed to equip you with the knowledge, skills, and confidence to excel in the MRCGP SCA exam.",
      price: 199,
    },
    {
      id: 3,
      tag: "Session",
      img: "/Images/card image.png",
      title: "Native MRCGP SCA General Mock Experience – 100+ Cases",
      desc: "Our Flagship Extensive Course is a 4-5 week intensive program. designed to equip you with the knowledge, skills, and confidence to excel in the MRCGP SCA exam.",
      price: 199,
    },
    {
      id: 4,
      tag: "Subscription",
      img: "/Images/card image.png",
      title: "1-on-1 Sessions with Dr Native (6 Cases)",
      desc: "Our Flagship Extensive Course is a 4-5 week intensive program. designed to equip you with the knowledge, skills, and confidence to excel in the MRCGP SCA exam.",
      price: 199,
    },
    {
      id: 5,
      tag: "Session",
      img: "/Images/card image.png",
      title: "1-on-1 Sessions with Dr Native (12 Cases)",
      desc: "Our Flagship Extensive Course is a 4-5 week intensive program. designed to equip you with the knowledge, skills, and confidence to excel in the MRCGP SCA exam.",
      price: 199,
    },
  ];

  const cardToShow = cutBy > 0 ? card.slice(0, cutBy) : card;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-9">
      {cardToShow.map((card) => (
        <Link href={`/products/${card.id}`} key={card.id}>
          <div
            role="link"
            tabIndex={0}
            className="rounded-[16px] border-[0.5px] border-[rgba(247, 244, 251, 1)] cardShadow space-y-3 sm:space-y-4 lg:space-y-8 overflow-y-hidden pb-3 sm:pb-4"
          >
            <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64">
              <Image
                src={card.img}
                alt={`image of ${card.title}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <p className="absolute rounded-[100px] py-2 px-3 top-2 right-5 bg-[#00000080] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
                {card.tag}
              </p>
            </aside>

            <aside className="px-3 sm:px-4 lg:px-6">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                  {card.title}
                </p>
                <p className="line-clamp-3 text-sm leading-[150%] text-[rgba(55, 55, 55, 1)] h-auto md:h-28 lg:h-28">
                  {card.desc}
                </p>
              </div>
            </aside>

            <div className="px-3 sm:px-4 lg:px-6 flex justify-between items-center">
              <p className="text-black-others text-base sm:text-lg tracking-[-1%] font-semibold leading-[120%]">
                <span>{`£${card.price.toFixed(2)}`}</span>
                <span className="text-xs font-medium">/month</span>
              </p>

              <Button className="bg-black-others shadow-[0px 4px 16px 0px rgba(0, 0, 0, 0.1)] font-bold text-xs sm:text-sm leading-[150%]">
                Buy Now
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
