"use client";
import ButtonTag from "@/components/shared/ButtonTag";
import TitleCase from "@/components/shared/TitleCase";
import { useRef, useState, useEffect, useCallback } from "react";

interface Testimonial {
  id: number;
  label: string;
  quote: string;
  author: string;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    label: "SCA Passed — February 2025",
    quote:
      "Thank you so much Native for all your help, guidance, teaching and patience and most importantly the support you gave!! I would not have passed today if it wasn't for this course!!! Believe it or not I could hear your voice hammering 'I will not forgive you if you miss out vaccines'",
    author: "Dr. Noor",
  },
  {
    id: 2,
    label: "SCA Passed — February 2025",
    quote:
      "There are no words that can describe how helpful and useful Native course is. He teaches in a very interesting way with his loud tone of voice that attracts my attention even after a long working day when I'm feeling tired and sleepy. Not only that, his course is also fun as his sense of humor is hilarious. God bless you Native!",
    author: "Dr. Khen",
    featured: true,
  },
  {
    id: 3,
    label: "SCA Passed — January 2025",
    quote:
      "This course was an absolute game changer for me. The way the material is broken down makes even the most complex topics feel approachable. I'm so glad I found Native before my exam.",
    author: "Dr. Aisha",
  },
  {
    id: 4,
    label: "SCA Passed — March 2025",
    quote:
      "I cannot recommend this enough. The structured notes, the energy in teaching, and the community support made all the difference. Passed first try!",
    author: "Dr. Khalid",
  },
  {
    id: 5,
    label: "SCA Passed — December 2024",
    quote:
      "Native's approach to teaching is unlike anything I'd experienced. Practical, engaging, and genuinely fun. The results speak for themselves.",
    author: "Dr. Fatima",
  },
];

function Testimonial() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateActiveDot = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackLeft = track.getBoundingClientRect().left;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-card]"),
    );
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateActiveDot, { passive: true });
    return () => track.removeEventListener("scroll", updateActiveDot);
  }, [updateActiveDot]);

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-card]"),
    );
    cards[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = e.pageX - track.offsetLeft;
    scrollLeftRef.current = track.scrollLeft;
    track.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-20 lg:pt-28 pb-10 sm:pb-14 md:pb-18 lg:pb-24">
      <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
        <ButtonTag title="Testimonials" />
        <TitleCase text="See what the community is saying about native medical Education" />
      </div>

      {/* Outer wrapper clips the overflow so the half-card peeks but doesn't cause page scroll */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scroll-smooth pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: "grab",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              data-card
              className="flex-none flex flex-col border-[rgba(155,124,209,1)] select-none py-4 px-4 sm:py-5 sm:px-6 lg:py-6 lg:px-8 border-[0.2px] rounded-[16px] bg-[rgba(245,239,255,1)] gap-2.5 sm:gap-3 lg:gap-4 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[calc(100%/2.5)]"
              style={{
                scrollSnapAlign: "start",
              }}
            >
              {/* Label */}
              <p className="font-semibold text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] text-black-others">
                {t.label}
              </p>

              {/* Quote */}
              <p className="text-xs sm:text-sm lg:text-lg leading-[130%] tracking-[-2%] text-secondary-100">
                <span>&ldquo;</span>
                {t.quote}
                <span>&rdquo;</span>
              </p>

              {/* Author */}
              <p className="font-semibold text-xs sm:text-sm lg:text-lg leading-[120%] tracking-[-2%] text-right">
                — {t.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === activeIndex ? "w-4 bg-[#7F77DD]" : "w-1.5 bg-[#D5D3EC]"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default Testimonial;
