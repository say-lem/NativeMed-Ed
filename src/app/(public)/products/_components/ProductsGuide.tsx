import Link from "next/link";
import { CheckCircle2, Signpost } from "lucide-react";

const GUIDE_ITEMS: { question: string; answer: string; href: string }[] = [
  {
    question: "Want to practise written cases?",
    answer: "Case Bank",
    href: "/products/case-bank",
  },
  {
    question: "Want a full structured course with lectures and mock sessions?",
    answer: "Courses",
    href: "/products?type=course#catalog",
  },
  {
    question: "Want to join live mock interview sessions?",
    answer: "Live Courses",
    href: "/products?type=live_course#catalog",
  },
  {
    question: "Want personalised 1-to-1 support?",
    answer: "1-to-1 Coaching",
    href: "/products?type=one_on_one#catalog",
  },
];

export default function ProductsGuide() {
  return (
    <section className="mt-10 sm:mt-14 lg:mt-16">
      <div className="rounded-[16px] border-[0.5px] border-[#F7F4FB] cardShadow bg-white p-5 sm:p-8 lg:p-10">
        <div className="flex items-start gap-4">
          <span className="grid place-items-center size-11 shrink-0 rounded-full bg-primary-10 text-primary-100">
            <Signpost size={22} />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-[130%] tracking-[-1%] text-black-others">
              Not sure which option is right for you?
            </h2>
            <p className="text-sm sm:text-base text-subtle-text mt-1">
              Here&apos;s a quick guide to help you choose.
            </p>
          </div>
        </div>

        <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          {GUIDE_ITEMS.map((item) => (
            <li key={item.answer}>
              <Link
                href={item.href}
                className="group flex flex-wrap items-center gap-2 rounded-[10px] -mx-2 px-2 py-1.5 transition-colors hover:bg-primary-10"
              >
                <CheckCircle2
                  size={18}
                  className="text-primary-100 shrink-0"
                />
                <span className="text-sm sm:text-base text-black-others">
                  {item.question}
                </span>
                <span className="text-sm sm:text-base font-bold text-primary-100 group-hover:underline">
                  &rarr; {item.answer}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
