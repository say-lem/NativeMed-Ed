"use client";
import ButtonTag from "@/components/shared/ButtonTag";
import TitleCase from "@/components/shared/TitleCase";
import { useEffect, useRef, useState } from "react";

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

const SCROLL_PX_PER_SEC = 40;

function Testimonial() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hoverRef = useRef(false);
  const interactRef = useRef(false);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);

  // Render the list twice. The track sits at the midpoint by default, so
  // forward (rightward) drift can wrap from 0 → half and reverse swipes
  // can wrap from half → 0 — both invisible because the halves are identical.
  const loop = [...testimonials, ...testimonials];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const initPos = () => {
      track.scrollLeft = track.scrollWidth / 2;
    };
    initPos();
    window.addEventListener("resize", initPos);

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const paused = hoverRef.current || interactRef.current;
      if (!paused && !mql.matches) {
        // Increasing scrollLeft makes content slide leftward.
        track.scrollLeft += SCROLL_PX_PER_SEC * dt;
      }

      const half = track.scrollWidth / 2;
      if (track.scrollLeft < 0) track.scrollLeft += half;
      else if (track.scrollLeft >= half) track.scrollLeft -= half;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", initPos);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pending = false;

    const update = () => {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-card]"),
      );
      if (!cards.length) return;
      const tr = track.getBoundingClientRect();
      const center = tr.left + tr.width / 2;
      let closest = 0;
      let min = Infinity;
      cards.forEach((card, i) => {
        const cr = card.getBoundingClientRect();
        const cardCenter = cr.left + cr.width / 2;
        const d = Math.abs(cardCenter - center);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActiveIndex(closest % testimonials.length);
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        update();
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(update);
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    interactRef.current = true;
    if (e.pointerType === "mouse") {
      const track = trackRef.current;
      if (!track) return;
      dragRef.current = { startX: e.clientX, startScroll: track.scrollLeft };
      track.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !trackRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    trackRef.current.scrollLeft = dragRef.current.startScroll - dx;
  };

  const endInteraction = (e: React.PointerEvent<HTMLDivElement>) => {
    interactRef.current = false;
    if (dragRef.current && trackRef.current) {
      trackRef.current.releasePointerCapture?.(e.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-20 lg:pt-28 pb-10 sm:pb-14 md:pb-18 lg:pb-24">
      <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
        <ButtonTag title="Testimonials" />
        <TitleCase text="See what the community is saying about native medical Education" />
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => {
          hoverRef.current = true;
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        className="overflow-x-auto cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-3 sm:gap-4 lg:gap-5 py-2">
          {loop.map((t, i) => {
            const orig = i % testimonials.length;
            const isActive = orig === activeIndex;
            return (
              <div
                key={`${t.id}-${i}`}
                data-card
                aria-hidden={i >= testimonials.length}
                className={`flex-none flex flex-col py-4 px-4 sm:py-5 sm:px-6 lg:py-6 lg:px-8 rounded-[16px] gap-2.5 sm:gap-3 lg:gap-4 w-72 sm:w-88 md:w-104 lg:w-120 transition-[opacity,border-color,box-shadow] duration-300 ${
                  isActive
                    ? "bg-[rgba(245,239,255,1)] border-2 border-primary opacity-100 shadow-md"
                    : "bg-[rgba(245,239,255,0.7)] border border-[rgba(155,124,209,0.4)] opacity-70"
                }`}
              >
                <p className="font-semibold text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] text-black-others">
                  {t.label}
                </p>

                <p className="text-xs sm:text-sm lg:text-lg leading-[130%] tracking-[-2%] text-secondary-100">
                  <span>&ldquo;</span>
                  {t.quote}
                  <span>&rdquo;</span>
                </p>

                <p className="font-semibold text-xs sm:text-sm lg:text-lg leading-[120%] tracking-[-2%] text-right">
                  — {t.author}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {testimonials.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-[#D5D3EC]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonial;
