import axios from "axios";
import { notFound } from "next/navigation";
import AdminContentHero from "@/components/shared/course-content/AdminContentHero";
import ContentManager from "@/components/shared/course-content/ContentManager";
import {
  getAdminCourse,
  getCourseContent,
} from "@/services/courses.service";
import type { Course, Lesson } from "@/types/api";
import { getPdfUploadSignatureAction } from "@/app/(admin)/actions";
import {
  addDriveLessonAction,
  addPdfLessonAction,
  deleteLessonAction,
  updateLessonAction,
} from "./actions";

const getPdfSignature = () => getPdfUploadSignatureAction("course-content");

async function loadCourse(id: string): Promise<Course | undefined> {
  try {
    const res = await getAdminCourse(id);
    return res.success ? res.data : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
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

export default async function CourseContentPage({
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
      <AdminContentHero title={course.title} backHref="/admin-courses" />
      <ContentManager
        courseId={id}
        lessons={lessons}
        actions={{
          getPdfSignature,
          addPdf: addPdfLessonAction,
          addDriveLink: addDriveLessonAction,
          update: updateLessonAction,
          remove: deleteLessonAction,
        }}
      />
    </section>
  );
}
