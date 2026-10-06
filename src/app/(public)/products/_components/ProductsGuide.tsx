import axios from "axios";
import Link from "next/link";
import { CheckCircle2, Signpost } from "lucide-react";
import { getCatalog } from "@/services/catalog.service";
import type { CatalogProduct } from "@/types/api";

type GuideItem = {
  question: string;
  answer: string;
  type: CatalogProduct["type"];
  /** Matched against a live product's title within `type` to link straight to
   *  it. Omitted for case_bank (single fixed page) and one_on_one (several
   *  variants exist — send those to the filtered list instead). */
  titleMatch?: RegExp;
  /** Used when there's no titleMatch, or the live catalog has no match for one
   *  (renamed/removed product) — always resolves to something real. */
  fallbackHref: string;
};

const GUIDE_ITEMS: GuideItem[] = [
  {
    question:
      "Want to practise a wide range of SCA exam-style cases at your own pace?",
    answer: "Native SCA Case Bank",
    type: "case_bank",
    fallbackHref: "/products/case-bank",
  },
  {
    question: "Want pre-recorded lectures + Q&A and mock session recordings?",
    answer: "Complete Recording Library",
    type: "course",
    titleMatch: /complete recording library/i,
    fallbackHref: "/products?type=course#catalog",
  },
  {
    question: "Want mock session recordings only?",
    answer: "Mock Recording Library",
    type: "course",
    titleMatch: /mock recording library/i,
    fallbackHref: "/products?type=course#catalog",
  },
  {
    question: "Want to attend and participate in live mock sessions?",
    answer: "Live General Mock Sessions",
    type: "live_course",
    titleMatch: /live general mock sessions/i,
    fallbackHref: "/products?type=live_course#catalog",
  },
  {
    question:
      "Want the full structured programme with teaching, live Q&A and live mocks?",
    answer: "Native SCA Extensive Course",
    type: "live_course",
    titleMatch: /extensive course/i,
    fallbackHref: "/products?type=live_course#catalog",
  },
  {
    question: "Want personalised one-to-one support?",
    answer: "1-to-1 Coaching",
    type: "one_on_one",
    fallbackHref: "/products?type=one_on_one#catalog",
  },
];

/** `/products/:id` for course/live_course, `/one-on-one/:id` for one_on_one —
 *  mirrors the linking convention in CatalogGrid. */
function productHref(product: CatalogProduct): string | null {
  if (product.type === "one_on_one") return `/one-on-one/${product._id}`;
  if (product.type === "course" || product.type === "live_course") {
    return `/products/${product._id}`;
  }
  return null;
}

async function resolveHrefs(): Promise<string[]> {
  let catalog: CatalogProduct[] = [];
  try {
    const res = await getCatalog();
    if (res.success) catalog = res.data;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[products-guide] fetch error:", err.code, err.message);
  }

  return GUIDE_ITEMS.map((item) => {
    if (!item.titleMatch) return item.fallbackHref;
    const match = catalog.find(
      (p) => p.type === item.type && item.titleMatch!.test(p.title),
    );
    if (!match) return item.fallbackHref;
    return productHref(match) ?? item.fallbackHref;
  });
}

export default async function ProductsGuide() {
  const hrefs = await resolveHrefs();

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
          {GUIDE_ITEMS.map((item, i) => (
            <li key={item.answer}>
              <Link
                href={hrefs[i]}
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
