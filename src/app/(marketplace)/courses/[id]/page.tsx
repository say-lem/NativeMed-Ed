import axios from "axios";
import Link from "next/link";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContainedImage from "@/components/shared/ContainedImage";
import { Markdown } from "@/components/shared/Markdown";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import CoursePurchase from "./_components/CoursePurchase";
import { getCourse } from "@/services/courses.service";
import { getHomepageData } from "@/services/homepage.service";
import { getCourseAccess } from "@/lib/access";
import { formatDate } from "@/lib/date";
import type { Course } from "@/types/api";

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

/** For the "payments paused" contact-admin message — falls back to null if unset/unavailable. */
async function loadContactEmail(): Promise<string | null> {
  try {
    const res = await getHomepageData();
    return res.success ? res.data.contactEmail : null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return null;
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [course, access, contactEmail] = await Promise.all([
    loadCourse(id),
    getCourseAccess(id),
    loadContactEmail(),
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
        <aside className="relative w-full md:basis-1/2 min-h-[35vh] sm:min-h-[40vh] md:min-h-[50vh] bg-gray-from-radial-bg rounded-lg overflow-hidden">
          <ContainedImage
            src={course.thumbnailUrl || "/Images/coursesImage.png"}
            alt={`image of ${course.title}`}
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

      {/* Longer write-up — outside the hero card, shown only when the admin has set one.
          Stored as markdown from the admin's rich-text editor. */}
      {course.detailedDescription && (
        <div className="space-y-3">
          <h2 className="font-semibold text-xl sm:text-2xl text-black-others">
            About this course
          </h2>
          <Markdown className="text-sm sm:text-base text-[#373737]">
            {course.detailedDescription}
          </Markdown>
        </div>
      )}

      {/* No access → choose a plan (access users get the CTA in the top bar) */}
      {!access.hasAccess && (
        <div className="space-y-5">
          <h2 className="font-semibold text-xl sm:text-2xl text-black-others">
            Choose your plan
          </h2>
          <CoursePurchase course={course} contactEmail={contactEmail} />
        </div>
      )}
      </section>
    </>
  );
}
