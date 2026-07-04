import axios from "axios";
import UploadCourseForm from "./_components/UploadCourseForm";
import UploadCourseHero from "./_components/UploadCourseHero";
import { getCourse } from "@/services/courses.service";
import { courseToFormValues } from "@/lib/schemas/course";
import type { Course } from "@/types/api";

async function loadCourse(id: string): Promise<Course | undefined> {
  try {
    const res = await getCourse(id);
    return res.success ? res.data : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
  }
}

export default async function UploadCoursePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const course = id ? await loadCourse(id) : undefined;
  const initialValues = course ? courseToFormValues(course) : undefined;

  return (
    <>
      <UploadCourseHero mode={course ? "edit" : "add"} />
      <UploadCourseForm
        courseId={course?._id}
        initialValues={initialValues}
        initialThumbnail={course?.thumbnailUrl}
      />
    </>
  );
}
