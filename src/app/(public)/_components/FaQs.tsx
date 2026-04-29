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
    question: "What is the Native SCA Extensive Course?",
    answer:
      "The Native SCA Extensive Course is a comprehensive preparation programme designed to help doctors pass the MRCGP SCA exam. It includes structured teaching, real exam-style mock consultations, and expert guidance.",
  },
  {
    id: 2,
    question:
      "What is the Native MRCGP SCA General Mock Sessions – 100+ Cases?",
    answer:
      "A general mock programme covering 100+ real exam-style SCA cases. Candidates have the opportunity to perform one full station, while also observing other candidates perform multiple cases, with immediate feedback given after each case. This allows you to learn both by doing and by watching a wide range of consultation styles. Opportunities to perform are offered on a first come, first served basis, so you should indicate your interest as soon as you join the session. This course is included free with the full Native SCA Extensive Course.",
  },
  {
    id: 3,
    question:
      "Should I join the Extensive Course or just the Mock Sessions? What is the difference?",
    answer:
      "The Extensive Course is a complete preparation package. It starts with structured lectures covering focused history, examination, and management of common GP presentations, giving you a strong knowledge base. It then progresses to the 100+ mock sessions to help you apply that knowledge and develop your communication skills. We believe confidence comes from being knowledgeable and up to date. Even if you communicate well, without the right clinical knowledge, passing the exam is difficult. The 100+ Mock Sessions are focused on practice only. They are designed to test your application and interpersonal skills through real exam-style cases. If you are unsure where to start or need a solid foundation, the Extensive Course is the best option. If you already have a strong knowledge base and feel confident, you can join the Mock Sessions only.",
  },
  {
    id: 4,
    question: "Are the lectures live or pre-recorded?",
    answer:
      "Core lectures are pre-recorded for flexibility. Live sessions are used for Q&A and mock practice.",
  },
  {
    id: 5,
    question:
      "What if I cannot attend the live sessions due to other commitments?",
    answer:
      "If you cannot attend live, do not worry. All sessions are recorded and uploaded to our Google Drive and Telegram channel, which you will be added to. You can access and watch them at your convenience.",
  },
  {
    id: 6,
    question: "How long do I have access to the course recordings?",
    answer:
      "You will have 3 months access to all recordings and materials from the end of the course.",
  },
  {
    id: 7,
    question: "When should I join the course?",
    answer:
      "We recommend joining 2 to 3 months before your exam, so you have enough time to cover the material and practise effectively. If you are unsure, contact us and we will guide you.",
  },
  {
    id: 8,
    question: "Will the NATIVE course guarantee I pass?",
    answer:
      "No course can guarantee a pass. However, we provide the structure, strategy, and practice needed to significantly improve your chances. Many of our candidates go on to successfully pass the exam after completing our course, which is why we have become a popular and trusted course for SCA preparation.",
  },
  {
    id: 9,
    question: "I am short on time, can I still manage this?",
    answer:
      "Yes. The course is designed to be flexible, with recorded lectures that you can watch at your own pace. If you are unsure, please contact us and we will guide you based on your individual situation.",
  },
  {
    id: 10,
    question: "I failed before, will this help me?",
    answer:
      "Yes, many of our candidates join after previous attempts and benefit from our structured approach.",
  },
  {
    id: 11,
    question: "What is the Native MRCGP SCA Case Bank Monthly Subscription?",
    answer:
      "A subscription-based case bank of realistic SCA-style scenarios, designed to reflect the format and standard of the real exam. You can use it to practise with a partner or study independently, helping you build confidence in consultation structure, communication, and clinical reasoning.",
  },
  {
    id: 12,
    question:
      "What makes the Native MRCGP SCA Case Bank different from other commercial question banks?",
    answer:
      "Our cases are designed in a simple, easy-to-follow format to support both learning and exam performance. Each case includes: Key questions to ask, Up-to-date management, Example explanations to improve communication skills, Learning points to deepen understanding. Our case bank is also widely recommended by candidates, reflecting its practicality and effectiveness for SCA preparation.",
  },
  {
    id: 13,
    question: "Can I claim back the course fee from my deanery?",
    answer:
      "You may be able to claim the course fee through your deanery study budget, but this depends on your local policy and available funding. We can provide a receipt upon payment and a certificate of attendance on request to support your claim.",
  },
  {
    id: 14,
    question: "Can I get a refund?",
    answer:
      "Due to the nature of digital access and materials, refunds are generally not offered once access has been granted.",
  },
  {
    id: 15,
    question: "Can I extend my access?",
    answer:
      "Access is limited to the stated duration. Extensions are not provided free of charge.",
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

      <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] xl:h-[85vh] max-h-225">
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
