"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { StatVideoIcon } from "../../admin-dashboard/_components/StatIcons";
import Link from "next/link";

type CourseTag = "Course" | "Session";

type AdminCourse = {
  id: number;
  tag: CourseTag;
  title: string;
  description: string;
  price: string;
  img: string;
};

const courses: AdminCourse[] = [
  {
    id: 1,
    tag: "Course",
    title: "Native MRCGP SCA General Mock Experience – 100+ Cases",
    description:
      "Practice full case stations, observe in real time and get structured feedback.",
    price: "£289.00",
    img: "/Images/coursesImage.png",
  },
  {
    id: 2,
    tag: "Course",
    title: "Native MRCGP SCA Extensive Course",
    description:
      "Our Flagship Extensive Course is a 4-5 week intensive revision programme.",
    price: "£199.00",
    img: "/Images/coursesImage.png",
  },
  {
    id: 3,
    tag: "Session",
    title: "1-on-1 Sessions with Dr Native (6 Cases)",
    description:
      "Our Flagship Extensive Course is a 4-5 week intensive revision programme.",
    price: "£300.00",
    img: "/Images/coursesImage.png",
  },
  {
    id: 4,
    tag: "Session",
    title: "1-on-1 Sessions with Dr Native (12 Cases)",
    description:
      "Our Flagship Extensive Course is a 4-5 week intensive revision programme.",
    price: "£500.00",
    img: "/Images/coursesImage.png",
  },
];

const FILTERS = ["All", "Course", "Session"];

export default function AdminCourses() {
  const [filter, setFilter] = useState("All");

  const rows = courses.filter((c) =>
    filter === "All" ? true : c.tag === filter,
  );

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10">
      {/* Filter + create */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-[190px]">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none w-full h-10 rounded-[4px] border-[0.5px] border-black px-4 py-2 pr-10 text-sm text-black bg-white cursor-pointer outline-none"
          >
            {FILTERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black"
          />
        </div>

        <Link
          href={"/admin-courses/upload-course"}
          className="rounded-[8px] border border-gray-1 py-3 px-4 cursor-pointer flex items-center gap-2 hover:bg-[#2D135C] group"
        >
          <StatVideoIcon className="text-[#6F6F6F] group-hover:text-white" />
          <span className="text-black leading-[130%] font-medium text-sm tracking-[-2%] group-hover:text-white">
            Create Courses
          </span>
        </Link>
      </div>

      {/* Course cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-8">
        {rows.map((course) => (
          <div
            key={course.id}
            className="rounded-[16px] overflow-hidden courseBorder bg-white flex flex-col"
          >
            <aside className="relative w-full min-h-44 sm:min-h-48">
              <Image
                src={course.img}
                alt={`image of ${course.title}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <span className="absolute top-3 left-3 rounded-[100px] py-1.5 px-3 bg-[#00000080] border-[0.2px] border-white/80 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
                {course.tag}
              </span>
            </aside>

            <aside className="px-4 sm:px-5 py-4 flex flex-col gap-2 flex-1">
              <p className="text-base sm:text-lg font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                {course.title}
              </p>
              <p className="text-xs sm:text-sm leading-[150%] text-subtle-text line-clamp-2">
                {course.description}
              </p>

              <div className="mt-auto pt-3 flex items-center justify-between">
                <p className="text-base font-semibold text-black-others">
                  {course.price}
                </p>
                <button
                  type="button"
                  className="rounded-[8px] bg-black text-white text-sm font-medium px-5 py-2 cursor-pointer hover:bg-black/85"
                >
                  Edit
                </button>
              </div>
            </aside>
          </div>
        ))}
      </div>
    </section>
  );
}
