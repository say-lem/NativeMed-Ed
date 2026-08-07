import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  Video,
  Lock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { getCourse, getCourseContent } from "@/services/courses.service";
import { getCourseAccess } from "@/lib/access";
import { includesLectures } from "@/lib/tiers";
import type { Course, Lesson } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadCourse(id: string): Promise<Course | null> {
  try {
    const res = await getCourse(id);
    return res.success ? res.data : null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[my-course] fetch error:", err.code, err.message);
    return null;
  }
}

async function loadContent(id: string): Promise<Lesson[]> {
  try {
    const res = await getCourseContent(id);
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[my-course/content] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function CourseContentPage({ params }: PageProps) {
  const { id } = await params;
  const [course, access] = await Promise.all([
    loadCourse(id),
    getCourseAccess(id),
  ]);

  // Not entitled → send to the course page (which shows the plan picker).
  if (!access.hasAccess) redirect(`/courses/${id}`);

  const lessons = (await loadContent(id)).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  // The mock-sessions-only tier can't open the Google-Drive video lessons.
  const canWatchVideo = includesLectures(access.tier);

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text={course?.title ?? "Course content"} />
        <p className="text-white/80 text-sm sm:text-base">
          {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
        </p>
      </BannerBg>

      <section className="px-4 sm:px-8 lg:px-15 py-6 sm:py-8 space-y-6">
        <Link
          href="/my-courses"
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others"
        >
          <ChevronLeft size={18} /> Back to My Courses
        </Link>

        {lessons.length === 0 ? (
          <p className="text-center text-subtle-text py-16">
            No lessons have been added to this course yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {lessons.map((lesson) => {
              const video = lesson.type === "video";
              const locked = video && !canWatchVideo;
              const Icon = video ? Video : FileText;

              const inner = (
                <>
                  <span className="grid place-items-center size-10 rounded-full bg-primary-10 text-primary-100 shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black-others truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-subtle-text capitalize">
                      {lesson.type}
                      {lesson.duration ? ` · ${lesson.duration}` : ""}
                    </p>
                  </div>
                  {locked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-subtle-text shrink-0">
                      <Lock size={14} /> PDF + Drive only
                    </span>
                  ) : video ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-subtle-text shrink-0">
                      <ExternalLink size={14} /> Open in Drive
                    </span>
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-subtle-text shrink-0"
                    />
                  )}
                </>
              );

              const rowClass =
                "flex items-center gap-4 rounded-[12px] border border-gray-1 bg-white p-4 hover:border-black-others transition-colors";

              return (
                <li key={lesson._id}>
                  {locked ? (
                    <div className="flex items-center gap-4 rounded-[12px] border border-gray-1 bg-white p-4 opacity-70">
                      {inner}
                    </div>
                  ) : video ? (
                    // Videos are Google-Drive links — open externally, not in-app.
                    lesson.fileUrl ? (
                      <a
                        href={lesson.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={rowClass}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div
                        className={`${rowClass} opacity-70 pointer-events-none`}
                      >
                        {inner}
                      </div>
                    )
                  ) : (
                    <Link
                      href={`/my-courses/${id}/${lesson._id}`}
                      className={rowClass}
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
