"use client";
import ButtonTag from "@/components/shared/ButtonTag";
import TitleCase from "@/components/shared/TitleCase";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDatePassed } from "@/lib/reviews";
import { useAutoScrollCarousel } from "@/hooks/useAutoScrollCarousel";
import type { Review } from "@/types/api";

function Testimonial({ reviews }: { reviews: Review[] }) {
  const { trackRef, activeIndex, trackProps } = useAutoScrollCarousel(
    reviews.length,
  );

  // Render the list twice. The track sits at the midpoint by default, so
  // forward (rightward) drift can wrap from 0 → half and reverse swipes
  // can wrap from half → 0 — both invisible because the halves are identical.
  const loop = [...reviews, ...reviews];

  if (reviews.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-20 lg:pt-28 pb-10 sm:pb-14 md:pb-18 lg:pb-24">
      <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
        <ButtonTag title="Testimonials" />
        <TitleCase text="See what Doctors say about native medical Education" />
      </div>

      <div
        ref={trackRef}
        {...trackProps}
        className="overflow-x-auto cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-3 sm:gap-4 lg:gap-5 py-2">
          {loop.map((t, i) => {
            const orig = i % reviews.length;
            const isActive = orig === activeIndex;
            return (
              <div
                key={`${t._id}-${i}`}
                data-card
                aria-hidden={i >= reviews.length}
                className={`flex-none flex flex-col py-4 px-4 sm:py-5 sm:px-6 lg:py-6 lg:px-8 rounded-[16px] gap-2.5 sm:gap-3 lg:gap-4 w-72 sm:w-88 md:w-104 lg:w-120 transition-[opacity,border-color,box-shadow] duration-300 ${
                  isActive
                    ? "bg-[rgba(245,239,255,1)] border-2 border-primary opacity-100 shadow-md"
                    : "bg-[rgba(245,239,255,0.7)] border border-[rgba(155,124,209,0.4)] opacity-70"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] text-black-others">
                    {t.examSat} Passed — {formatDatePassed(t.datePassed)}
                  </p>
                  <div className="flex shrink-0 gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        className={
                          n <= t.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-transparent text-gray-1"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm lg:text-lg leading-[130%] tracking-[-2%] text-secondary-100">
                  <span>&ldquo;</span>
                  {t.review}
                  <span>&rdquo;</span>
                </p>

                <p className="font-semibold text-xs sm:text-sm lg:text-lg leading-[120%] tracking-[-2%] text-right">
                  — {t.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {reviews.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-[#D5D3EC]"
            }`}
          />
        ))}
      </div>

      <Link
        href="/reviews"
        className="mt-4 sm:mt-6 text-primary-100 leading-[150%] font-semibold flex items-center gap-2 justify-end cursor-pointer hover:underline underline-offset-2"
      >
        <span>See all</span>
        <Image
          src={"/Images/arrow-foward-purple.png"}
          alt="arrow forward"
          height={13.33}
          width={13.33}
        />
      </Link>
    </section>
  );
}

export default Testimonial;
