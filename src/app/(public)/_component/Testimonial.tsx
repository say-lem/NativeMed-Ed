"use client";
import ButtonTag from "@/components/shared/buttonTag";
import TitleCase from "@/components/shared/titleCase";
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

// Show 2 full cards + ~half of the next one.
// Card width = (containerWidth - gaps) / 2.5
// We express this as a calc() so it's responsive.
const CARD_WIDTH = "calc((100%) / 2.5)";

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
    <section className="px-15 pt-28 pb-24">
      <div className="text-center mx-auto w-[50%] mb-12">
        <ButtonTag title="Testimonials" />
        <TitleCase text="See what the community is saying about native medical Education" />
      </div>

      {/* Outer wrapper clips the overflow so the half-card peeks but doesn't cause page scroll */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4"
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
              className="flex-none flex flex-col border-[rgba(155,124,209,1)] select-none py-6 px-8 border-[0.2px] rounded-[16px] bg-[rgba(245,239,255,1)] gap-4"
              style={{
                scrollSnapAlign: "start",
                width: CARD_WIDTH,
                minWidth: CARD_WIDTH,
              }}
            >
              {/* Label */}
              <p className="font-semibold text-lg leading-[120%] tracking-[-2%] text-blackOthers">
                {t.label}
              </p>

              {/* Quote */}
              <p className="text-lg leading-[130%] tracking-[-2%] text-Secondary100">
                <span>&ldquo;</span>
                {t.quote}
                <span>&rdquo;</span>
              </p>

              {/* Author */}
              <p className="font-semibold text-lg leading-[120%] tracking-[-2%] text-right">
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
