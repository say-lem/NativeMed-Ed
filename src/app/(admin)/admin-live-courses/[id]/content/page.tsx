import axios from "axios";
import { notFound } from "next/navigation";
import AdminContentHero from "@/components/shared/course-content/AdminContentHero";
import ContentManager from "@/components/shared/course-content/ContentManager";
import {
  getAdminLiveCourse,
  getLiveCourseContent,
} from "@/services/liveCourses.service";
import type { Lesson, LiveCourse } from "@/types/api";
import {
  addDriveLessonAction,
  addPdfLessonAction,
  deleteLessonAction,
  getPdfSignatureAction,
  updateLessonAction,
} from "./actions";

async function loadCourse(id: string): Promise<LiveCourse | undefined> {
  try {
    const res = await getAdminLiveCourse(id);
    return res.success ? res.data : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
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

export default async function LiveCourseContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await loadCourse(id);
  if (!course) notFound();

  const lessons = await loadContent(id);

  return (
    <section>
      <AdminContentHero title={course.title} backHref="/admin-live-courses" />
      <ContentManager
        courseId={id}
        lessons={lessons}
        actions={{
          getPdfSignature: getPdfSignatureAction,
          addPdf: addPdfLessonAction,
          addDriveLink: addDriveLessonAction,
          update: updateLessonAction,
          remove: deleteLessonAction,
        }}
      />
    </section>
  );
}
