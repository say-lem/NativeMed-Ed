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
      <section className="px-4 md:px-15 pt-12 md:pt-24 pb-12 md:pb-24">
        <div className="text-center mx-auto w-full sm:w-[90%] md:w-[50%] mb-6 md:mb-12">
          <ButtonTag title="FAQs" />
          <TitleCase text="Your Questions answered" />
        </div>

        <div className="divide-y-[0.5px] divide-gray-2">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div className="px-2 md:px-5" key={faq.id}>
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-3 md:gap-6 py-4 md:py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base md:text-2xl leading-[120%] tracking-[-2%] cursor-pointer text-left">
                    {faq.question}
                  </span>
                  <span className="text-black/60">
                    <ChevronDown open={isOpen} />
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-sm md:text-base px-2 md:px-6 leading-[160%] text-black-others text-center">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="relative w-full h-[50vh] md:h-screen">
        <Image
          src="/Images/doctorsGiving.svg"
          alt="givingDoctors Image"
          fill
          className="object-fill"
        />
      </div>
    </>
  );
}

export default FaQs;
