import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import PdfViewer from "@/components/shared/PdfViewer";
import { getLiveCourse, getLiveCourseContent } from "@/services/liveCourses.service";
import { getLiveCourseAccess } from "@/lib/access";
import type { Lesson, LiveCourse } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

async function loadCourse(id: string): Promise<LiveCourse | null> {
  try {
    const res = await getLiveCourse(id);
    return res.success ? res.data : null;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return null;
  }
}

async function loadContent(id: string): Promise<Lesson[]> {
  try {
    const res = await getLiveCourseContent(id);
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

export default async function LiveCourseLessonViewerPage({ params }: PageProps) {
  const { id, lessonId } = await params;
  const [access, course, lessons] = await Promise.all([
    getLiveCourseAccess(id),
    loadCourse(id),
    loadContent(id),
  ]);

  if (!access.hasAccess) redirect(`/live-courses/${id}`);

  const lesson = lessons.find((l) => l._id === lessonId);
  if (!lesson) redirect(`/my-live-courses/${id}`);

  // Only PDFs are viewed in-app. Video/audio lessons are Google-Drive links opened
  // externally from the lesson list — never rendered here.
  if (lesson.type === "video" || lesson.type === "audio") {
    redirect(`/my-live-courses/${id}`);
  }

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text={course?.title ?? "Live course"} />
        <p className="text-white/80 text-sm sm:text-base text-center">
          {lesson.title}
        </p>
      </BannerBg>

      <section className="px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <Link
          href={`/my-live-courses/${id}`}
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others"
        >
          <ChevronLeft size={18} /> Back to lessons
        </Link>

        <PdfViewer fileUrl={`/api/live-courses/${id}/content/${lessonId}`} />
      </section>
    </>
  );
}
