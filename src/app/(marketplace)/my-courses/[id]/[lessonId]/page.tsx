import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import PdfViewer from "@/components/shared/PdfViewer";
import { getCourse, getCourseContent } from "@/services/courses.service";
import { getCourseAccess } from "@/lib/access";
import type { Course, Lesson } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

async function loadCourse(id: string): Promise<Course | null> {
  try {
    const res = await getCourse(id);
    return res.success ? res.data : null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return null;
  }
}

async function loadContent(id: string): Promise<Lesson[]> {
  try {
    const res = await getCourseContent(id);
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

export default async function LessonViewerPage({ params }: PageProps) {
  const { id, lessonId } = await params;
  const [access, course, lessons] = await Promise.all([
    getCourseAccess(id),
    loadCourse(id),
    loadContent(id),
  ]);

  if (!access.hasAccess) redirect(`/courses/${id}`);

  const lesson = lessons.find((l) => l._id === lessonId);
  if (!lesson) redirect(`/my-courses/${id}`);

  // Only PDFs are viewed in-app. Video lessons are Google-Drive links opened
  // externally from the lesson list — never rendered here.
  if (lesson.type === "video") redirect(`/my-courses/${id}`);

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text={course?.title ?? "Course"} />
        <p className="text-white/80 text-sm sm:text-base text-center">
          {lesson.title}
        </p>
      </BannerBg>

      <section className="px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <Link
          href={`/my-courses/${id}`}
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others"
        >
          <ChevronLeft size={18} /> Back to lessons
        </Link>

        <PdfViewer fileUrl={`/api/courses/${id}/content/${lessonId}`} />
      </section>
    </>
  );
}
