import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import CoursePurchase from "./_components/CoursePurchase";
import { getCourse } from "@/services/courses.service";
import { getPaymentPlans } from "@/services/payments.service";
import { getCourseAccess } from "@/lib/access";
import { tierLabel } from "@/lib/tiers";
import { formatDate } from "@/lib/date";
import type { Course, PaymentPlan } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadCourse(id: string): Promise<Course | null> {
  try {
    const res = await getCourse(id);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[course-detail] fetch error:", err.code, err.message);
    } else {
      console.error("[course-detail] unexpected error:", err);
    }
    return null;
  }
}

async function loadPlans(): Promise<PaymentPlan[]> {
  try {
    const res = await getPaymentPlans();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[payments/plans] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [course, plans, access] = await Promise.all([
    loadCourse(id),
    loadPlans(),
    getCourseAccess(id),
  ]);

  if (!course) {
    return (
      <section className="px-4 sm:px-8 lg:px-15 py-16">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others mb-8"
        >
          <ChevronLeft size={18} /> Back to courses
        </Link>
        <p className="text-center text-subtle-text py-12">
          We couldn&apos;t load this course. It may have been removed, or the
          backend is unavailable.
        </p>
      </section>
    );
  }

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text={course.title} />
      </BannerBg>

      <section className="px-4 sm:px-8 lg:px-15 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* Top bar: back link + (when unlocked) access badge & CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others"
        >
          <ChevronLeft size={18} /> Back to courses
        </Link>

        {access.hasAccess && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-sm font-medium text-green-700">
              <CheckCircle2 size={16} />
              You have access
              {access.tier ? ` — ${tierLabel(access.tier)}` : ""}
            </div>
            {access.currentPeriodEnd && (
              <span className="text-xs text-subtle-text">
                {access.cancelAtPeriodEnd ? "Access until" : "Renews"}{" "}
                {formatDate(access.currentPeriodEnd)}
              </span>
            )}
            <Link href={`/my-courses/${course._id}`}>
              <Button className="font-bold text-sm sm:text-base bg-black-others">
                Go to course
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="authFormBorder rounded-[16px] p-3 sm:p-4 gap-4 sm:gap-6 lg:gap-8 flex flex-col md:flex-row overflow-hidden">
        <aside className="relative w-full md:basis-1/2 min-h-[35vh] sm:min-h-[40vh] md:min-h-[50vh]">
          <Image
            src={course.thumbnailUrl || "/Images/coursesImage.png"}
            alt={`image of ${course.title}`}
            fill
            className="object-cover object-center rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </aside>

        <aside className="w-full md:basis-1/2 flex flex-col justify-center gap-3 sm:gap-4">
          {course.description && (
            <p className="font-light text-sm sm:text-base lg:text-lg leading-[150%] text-[#373737] whitespace-pre-line">
              {course.description}
            </p>
          )}
        </aside>
      </div>

      {/* No access → choose a plan (access users get the CTA in the top bar) */}
      {!access.hasAccess && (
        <div className="space-y-5">
          <h2 className="font-semibold text-xl sm:text-2xl text-black-others">
            Choose your plan
          </h2>
          <CoursePurchase course={course} plans={plans} />
        </div>
      )}
      </section>
    </>
  );
}
