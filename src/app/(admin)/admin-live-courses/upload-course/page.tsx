import axios from "axios";
import UploadLiveCourseForm from "./_components/UploadLiveCourseForm";
import UploadLiveCourseHero from "./_components/UploadLiveCourseHero";
import { getAdminLiveCourse } from "@/services/liveCourses.service";
import { liveCourseToFormValues } from "@/lib/schemas/liveCourse";
import type { AdminLiveCourse } from "@/types/api";

async function loadCourse(id: string): Promise<AdminLiveCourse | undefined> {
  try {
    const res = await getAdminLiveCourse(id);
    return res.success ? res.data : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
  }
}

export default async function UploadLiveCoursePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const course = id ? await loadCourse(id) : undefined;
  const initialValues = course ? liveCourseToFormValues(course) : undefined;

  return (
    <>
      <UploadLiveCourseHero mode={course ? "edit" : "add"} />
      <UploadLiveCourseForm
        courseId={course?._id}
        initialValues={initialValues}
        initialThumbnail={course?.thumbnailUrl}
      />
    </>
  );
}
