import axios from "axios";
import Image from "next/image";
import Link from "next/link";
// import CountDownToClass from "@/components/shared/Countdown";
import ProductsCard from "@/components/shared/ProductsCard";
import TitleCase from "@/components/shared/TitleCase";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/services/courses.service";
import type { Course } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** The public course list is available unauthenticated; find the one by id
 *  (the single-course endpoint requires auth). */
async function loadCourse(id: string): Promise<Course | null> {
  try {
    const res = await getCourses();
    if (!res.success) return null;
    return res.data.find((c) => c._id === id) ?? null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[product-detail] fetch error:", err.code, err.message);
    return null;
  }
}

export default async function ProductByIdPage({ params }: PageProps) {
  const { id } = await params;
  const course = await loadCourse(id);

  if (!course) {
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

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-8 sm:pt-12 lg:pt-20 pb-16 sm:pb-24 lg:pb-36">
        <aside className="px-0 sm:px-4 lg:px-10">
          <div className="authFormBorder rounded-[16px] p-3 sm:p-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 flex flex-col md:flex-row justify-center overflow-x-hidden">
            <aside className="relative w-full md:basis-1/2 min-h-[35vh] sm:min-h-[40vh] md:min-h-[50vh] lg:min-h-[60vh]">
              <Image
                src={course.thumbnailUrl || "/Images/card image.png"}
                alt={`image of ${course.title}`}
                fill
                className="object-cover object-center rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </aside>
            <aside className="w-full md:basis-1/2 flex flex-col justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] tracking-[-2%] text-black-others">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="font-light text-sm sm:text-base lg:text-xl leading-[150%] text-[#373737] whitespace-pre-line">
                    {course.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-end">
                <Link href={`/courses/${course._id}`}>
                  <Button className="font-bold text-sm sm:text-base bg-black-others w-full">
                    Get this course
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </aside>
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
