"use client";
import { useState } from "react";
import type { Faq } from "@/types/api";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (faqs.length === 0) return null;

  return (
    <div className="divide-y-[0.5px] divide-gray-2">
      {faqs.map((faq) => {
        const isOpen = openId === faq._id;

        return (
          <div className="px-1 sm:px-2 lg:px-5" key={faq._id}>
            <button
              onClick={() => toggle(faq._id)}
              className="w-full flex items-center justify-between gap-2 sm:gap-3 lg:gap-6 py-3 sm:py-4 lg:py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-sm sm:text-base md:text-lg lg:text-2xl leading-[120%] tracking-[-2%] cursor-pointer text-left">
                {faq.question}
              </span>
              <span className="text-black/60">
                <ChevronDown open={isOpen} />
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 pb-4 sm:pb-6" : "max-h-0"
              }`}
            >
              <p className="text-xs sm:text-sm lg:text-base px-1 sm:px-2 lg:px-6 leading-[160%] text-black-others text-center">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
