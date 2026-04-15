"use client";
import ButtonTag from "@/components/shared/ButtonTag";
import TitleCase from "@/components/shared/TitleCase";
import Image from "next/image";
import { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "See what the community is saying about native medical Education",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    question: "See what the community is saying about native medical Education",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    question: "See what the community is saying about native medical Education",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    question: "See what the community is saying about native medical Education",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 5,
    question: "See what the community is saying about native medical Education",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

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

function FaQs() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-18 lg:pt-24 pb-10 sm:pb-14 md:pb-18 lg:pb-24">
        <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <ButtonTag title="FAQs" />
          <TitleCase text="Your Questions answered" />
        </div>

        <div className="divide-y-[0.5px] divide-gray-2">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div className="px-1 sm:px-2 lg:px-5" key={faq.id}>
                <button
                  onClick={() => toggle(faq.id)}
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
      </section>

      <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] xl:h-[85vh] max-h-[900px]">
        <Image
          src="/Images/doctorsGiving.svg"
          alt="givingDoctors Image"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </>
  );
}

export default FaQs;
