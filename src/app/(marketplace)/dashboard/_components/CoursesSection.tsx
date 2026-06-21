import CourseVariantCard, { type CourseItem } from "./CourseVariantCard";
import { getCourses } from "@/services/courses.service";

const items: CourseItem[] = [
  {
    id: 1,
    tag: "Mock",
    title: "Native MRCGP SCA General Mock Experience – 100+ Cases",
    img: "/Images/coursesImage.png",
  },
  {
    id: 2,
    tag: "Course",
    title: "Native MRCGP SCA Extensive Course",
    img: "/Images/coursesImage.png",
  },
];

export default async function CoursesSection() {
  // TEMP: probe the live shape of GET /courses (logs to the dev-server terminal).
  try {
    const res = await getCourses();
    console.log("[GET /courses] raw response:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.log("[GET /courses] error:", err);
  }

  return (
    <section className="px-4 sm:px-6 lg:px-10 space-y-4 pb-4">
      <h2 className="text-lg sm:text-xl font-semibold text-black-others leading-[130%] tracking-[-2%]">
        Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => (
          <CourseVariantCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
