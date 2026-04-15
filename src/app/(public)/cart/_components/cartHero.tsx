import TitleCase from "@/components/shared/TitleCase";
import SubtleText from "@/components/shared/SubtleText";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CartHero() {
  const cart = [
    {
      id: 1,
      tag: "Popular",
      img: "/Images/card image.png",
      title: "MRCGP SCA Revision",
      amt: 19.99,
      desc: "Get access to over 150 comprehensive practice cases for just £19.99 per month",
      descList: [
        "Over 150 comprehensive practice cases",
        "Monthly updated content",
        "Exam-focused approach",
        "Cancel anytime",
      ],
    },
    {
      id: 2,
      tag: "Popular",
      img: "/Images/card image.png",
      title: "MRCGP SCA Revision",
      amt: 19.99,
      desc: "Get access to over 150 comprehensive practice cases for just £19.99 per month",
      descList: [
        "Over 150 comprehensive practice cases",
        "Monthly updated content",
        "Exam-focused approach",
        "Cancel anytime",
      ],
    },
  ];

  // loop through cart
  const cartDisplay = cart.map((item) => (
    <div
      key={item.id}
      className="bg-white authFormBorder rounded-[16px] p-3 sm:p-4 gap-4 sm:gap-6 lg:gap-12 flex flex-col sm:flex-row items-start"
    >
      <aside className="w-full sm:basis-1/2">
        {/* Cart Image */}
        <div className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64 ">
          <Image
            src={item.img}
            alt={`image of ${item.title}`}
            fill
            className="rounded-[8px] object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <p className="absolute rounded-[100px] py-2 px-3 top-2 right-5 bg-[rgba(0, 0, 0, 0.5)] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
            {item.tag}
          </p>
        </div>
      </aside>

      <aside className="space-y-3 sm:space-y-4">
        {/* Cart text */}
        <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] tracking-[-2%] text-black-others">
          {item.title}
        </h2>
        <h4 className="font-semibold text-2xl sm:text-3xl lg:text-4xl leading-[120%] tracking-[-1%] text-black-others">
          £{item.amt.toFixed(2)}
          <span className="text-base sm:text-lg lg:text-xl font-normal leading-[150%]">/month</span>
        </h4>
        <p className="font-light text-sm sm:text-base lg:text-xl leading-[150%] text-[#373737] ">
          {item.desc}
        </p>

        <ul className="py-2 sm:py-4 space-y-2 sm:space-y-3 text-[#373737]">
          <li className="font-bold text-base sm:text-lg lg:text-xl leading-[120%] tracking-[-1%]">
            What&apos;s Included
          </li>
          {item.descList.map((itemDesc) => (
            <li key={itemDesc} className="flex gap-2 sm:gap-3 items-center text-sm sm:text-base">
              <span>
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3319 7.50251C17.7125 9.37026 17.4412 11.312 16.5634 13.004C15.6856 14.696 14.2543 16.0359 12.5082 16.8003C10.762 17.5647 8.80658 17.7073 6.96797 17.2045C5.12937 16.7016 3.51872 15.5837 2.40462 14.037C1.29052 12.4904 0.740325 10.6085 0.845776 8.70534C0.951228 6.80213 1.70596 4.99259 2.9841 3.57849C4.26224 2.16439 5.98654 1.23121 7.86944 0.934559C9.75235 0.637911 11.68 0.995731 13.3311 1.94835M6.66439 8.33585L9.16439 10.8358L17.4977 2.50251"
                    stroke="#5925B3"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{itemDesc}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  ));

  return (
    <section className="pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient">
      <TitleCase text="Shopping Cart" />
      <SubtleText text={`${cart.length} items in your cart`} />

      <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row items-start gap-4">
        <aside className="space-y-4 w-full lg:basis-2/3">
          {/* Cart component */}
          {cartDisplay}
        </aside>

        <aside className="w-full lg:basis-1/3 bg-primary-white p-4 sm:p-6 rounded-[16px] space-y-4 sm:space-y-6">
          {/* Order Summary */}
          <h2 className="font-semibold text-xl sm:text-2xl leading-[130%] tracking-[-2%] text-black-others">
            Order Summary
          </h2>

          <div>
            {/* items in cart */}
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <p className="leading-[150%] text-subtle-text text-sm sm:text-base">{item.title}</p>
                <p className="font-semibold leading-[120%] tracking-[-2%] text-black-others text-sm sm:text-base">
                  £{item.amt.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t-[0.5px] pt-[17.6px] border-gray-2 flex justify-between">
            <p className="text-base sm:text-lg font-semibold leading-[120%] tracking-[-2%] text-black-others">
              Total
            </p>
            <p className="font-semibold text-xl sm:text-2xl leading-[130%] tracking-[-2%] text-primary-100">
              £{cart.reduce((a, b) => a + b.amt, 0).toFixed(2)}
            </p>
          </div>

          <Button className="w-full flex items-center text-white gap-2.5 text-sm">
            Proceed to Checkout
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.66667 0L5.49167 1.175L10.1417 5.83333H0V7.5H10.1417L5.49167 12.1583L6.66667 13.3333L13.3333 6.66667L6.66667 0Z"
                fill="white"
              />
            </svg>
          </Button>

          <div className="rounded-[12px] space-y-2 p-3 sm:p-4 bg-white">
            <h4 className="font-bold text-sm leading-5 text-primary-100">
              Secure Checkout
            </h4>
            <p className="text-xs leading-[150%] text-subtle-text">
              Your payment information is encrypted and secure. We accept Stripe
              and PayPal.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
