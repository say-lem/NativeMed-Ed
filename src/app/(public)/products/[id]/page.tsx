import axios from "axios";
import Link from "next/link";
// import CountDownToClass from "@/components/shared/Countdown";
import ContainedImage from "@/components/shared/ContainedImage";
import CourseSchedule from "@/components/shared/CourseSchedule";
import { Markdown } from "@/components/shared/Markdown";
import ProductsCard from "@/components/shared/ProductsCard";
import TitleCase from "@/components/shared/TitleCase";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/services/courses.service";
import { getLiveCourses } from "@/services/liveCourses.service";
import { formatMoney } from "@/lib/price";
import type { Course, LiveCourse } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

type Product =
  | { kind: "course"; data: Course }
  | { kind: "live_course"; data: LiveCourse };

/** The public course lists are available unauthenticated; find the one by id (the
 *  single-item endpoints require auth). Checks regular courses first, then live courses —
 *  both id spaces are Mongo ObjectIds with no overlap, so at most one will match. */
async function loadProduct(id: string): Promise<Product | null> {
  try {
    const [courses, liveCourses] = await Promise.all([getCourses(), getLiveCourses()]);

    if (courses.success) {
      const course = courses.data.find((c) => c._id === id);
      if (course) return { kind: "course", data: course };
    }
    if (liveCourses.success) {
      const liveCourse = liveCourses.data.find((c) => c._id === id);
      if (liveCourse) return { kind: "live_course", data: liveCourse };
    }
    return null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[product-detail] fetch error:", err.code, err.message);
    return null;
  }
}

export default async function ProductByIdPage({ params }: PageProps) {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) {
    return (
      <section className="px-4 sm:px-8 lg:px-15 py-24 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-black-others">
          Product not found
        </h1>
        <p className="text-subtle-text">
          This product may have been removed or is no longer available.
        </p>
        <Link
          href="/products"
          className="inline-block text-primary-100 font-semibold hover:underline"
        >
          Back to products
        </Link>
      </section>
    );
  }

  const { kind, data } = product;
  const ctaHref = kind === "course" ? `/courses/${data._id}` : `/live-courses/${data._id}`;
  const ctaLabel =
    kind === "course"
      ? "Get this course"
      : `Buy Now${data.price != null ? ` — ${formatMoney(data.price)}` : ""}`;

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-8 sm:pt-12 lg:pt-20 pb-16 sm:pb-24 lg:pb-36">
        <aside className="px-0 sm:px-4 lg:px-10">
          <div className="authFormBorder rounded-[16px] p-3 sm:p-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 flex flex-col md:flex-row justify-center overflow-x-hidden">
            <aside className="relative w-full md:basis-1/2 aspect-[4/3] bg-gray-from-radial-bg rounded-lg overflow-hidden">
              <ContainedImage
                src={data.thumbnailUrl || "/Images/card image.png"}
                alt={`image of ${data.title}`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </aside>
            <aside className="w-full md:basis-1/2 flex flex-col justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] tracking-[-2%] text-black-others">
                  {data.title}
                </h3>
                {data.description && (
                  <p className="font-light text-sm sm:text-base lg:text-xl leading-[150%] text-[#373737] whitespace-pre-line">
                    {data.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-end">
                <Link href={ctaHref}>
                  <Button className="font-bold text-sm sm:text-base bg-black-others w-full">
                    {ctaLabel}
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </aside>

        {/* Longer write-up — outside the hero card, shown only when the admin has set one.
            Stored as markdown from the admin's rich-text editor. */}
        {data.detailedDescription && (
          <aside className="px-0 sm:px-4 lg:px-10 pt-8 sm:pt-10 space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl text-black-others">
              About this course
            </h2>
            <Markdown className="text-sm sm:text-base lg:text-lg text-[#373737]">
              {data.detailedDescription}
            </Markdown>
          </aside>
        )}

        {product.kind === "live_course" && product.data.tocPdfUrl && (
          <aside className="px-0 sm:px-4 lg:px-10 pt-8 sm:pt-10">
            <CourseSchedule url={product.data.tocPdfUrl} />
          </aside>
        )}

        <aside className="pt-10 sm:pt-12 lg:pt-16 space-y-6 sm:space-y-8">
          <TitleCase text="You Might Also Like" />
          <div className="px-0 sm:px-4 lg:px-10">
            <ProductsCard cutBy={4} />
          </div>
        </aside>
      </section>
      {/* <CountDownToClass /> */}
    </>
  );
}
