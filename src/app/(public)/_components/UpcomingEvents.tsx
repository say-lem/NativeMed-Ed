"use client";
import EventDetails from "@/components/shared/EventDetails";
import ButtonTag from "@/components/shared/ButtonTag";
import SubtleText from "@/components/shared/SubtleText";
import TitleCase from "@/components/shared/TitleCase";
import Image from "next/image";
import Link from "next/link";
import { formatDateParts } from "@/lib/date";
import { useAutoScrollCarousel } from "@/hooks/useAutoScrollCarousel";
import type { Activity } from "@/types/api";

export default function UpcomingEvents({ events }: { events: Activity[] }) {
  const { trackRef, activeIndex, trackProps, shouldLoop } = useAutoScrollCarousel(
    events.length,
  );

  // Only duplicate the list (for a seamless scroll loop) once the hook has measured that
  // a single copy actually overflows the track — otherwise every card is already visible
  // at once, and duplicating would just show each activity twice.
  const loop = shouldLoop ? [...events, ...events] : events;

  if (events.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-18 lg:pt-24 pb-8 sm:pb-10">
      <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
        <ButtonTag title="Events" />
        <TitleCase text="Upcoming Events" />
        <SubtleText text="Live classes and mock sessions on the calendar — mark your dates." />
      </div>

      <div
        ref={trackRef}
        {...trackProps}
        className="overflow-x-auto cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-3 sm:gap-4 lg:gap-5 py-2">
          {loop.map((event, i) => {
            const { day, month } = formatDateParts(event.date);
            return (
              <div
                key={`${event._id}-${i}`}
                data-card
                aria-hidden={i >= events.length}
                className="flex-none flex gap-4 items-start py-4 px-4 sm:py-5 sm:px-6 rounded-[16px] w-72 sm:w-88 md:w-96 bg-[rgba(245,239,255,1)] border-2 border-primary opacity-100 shadow-md"
              >
                <div className="shrink-0 flex flex-col items-center justify-center rounded-[12px] bg-white w-14 h-14 sm:w-16 sm:h-16">
                  <span className="font-semibold text-lg sm:text-xl leading-none text-primary-100">
                    {day}
                  </span>
                  <span className="text-[11px] sm:text-xs uppercase tracking-wide text-primary-100">
                    {month}
                  </span>
                </div>
                <EventDetails event={event} duplicate={i >= events.length} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {events.map((_, i) => (
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
        href="/events"
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
