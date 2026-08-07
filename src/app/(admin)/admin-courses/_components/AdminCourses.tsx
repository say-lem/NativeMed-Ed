"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ListVideo, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatVideoIcon } from "../../admin-dashboard/_components/StatIcons";
import Link from "next/link";
import type { Course } from "@/types/api";
import { courseAdminPrice } from "@/lib/price";
import { useAdminList } from "../../_components/AdminListContext";
import Pagination from "../../_components/Pagination";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import { deleteCourseAction, togglePublishCourseAction } from "../actions";

const PAGE_SIZE = 6;

const FILTERS = ["All", "Published", "Draft"] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminCourses({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const { query, page, setPage } = useAdminList();
  const router = useRouter();
  const confirm = useConfirm();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const togglePublish = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const res = await togglePublishCourseAction(id);
      if (res.ok) toast.success(res.message ?? "Updated");
      else toast.error(res.message ?? "Something went wrong");
      setPendingId(null);
      router.refresh();
    });
  };

  const remove = async (course: Course) => {
    const ok = await confirm({
      title: "Delete course?",
      message: `"${course.title}" and its thumbnail will be permanently removed. This can't be undone.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setDeletingId(course._id);
    startTransition(async () => {
      const res = await deleteCourseAction(course._id);
      if (res.ok) toast.success(res.message ?? "Course deleted");
      else toast.error(res.message ?? "Something went wrong");
      setDeletingId(null);
      router.refresh();
    });
  };

  const q = query.trim().toLowerCase();
  const filtered = courses.filter((c) => {
    const byFilter =
      filter === "All"
        ? true
        : filter === "Published"
          ? c.isPublished
          : !c.isPublished;
    if (!byFilter) return false;
    if (!q) return true;
    return [c.title, c.description].some((f) => f?.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectFilter = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10">
      {/* Filter + create */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-[190px]">
          <select
            value={filter}
            onChange={(e) => selectFilter(e.target.value as Filter)}
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
      {rows.length === 0 ? (
        <p className="text-center text-subtle-text py-16">
          {q || filter !== "All"
            ? "No courses match your search."
            : "No courses yet. Create one to get started."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-8">
          {rows.map((course) => (
            <div
              key={course._id}
              className="rounded-[16px] overflow-hidden courseBorder bg-white flex flex-col"
            >
              <aside className="relative w-full min-h-44 sm:min-h-48">
                <Image
                  src={course.thumbnailUrl || "/Images/coursesImage.png"}
                  alt={`image of ${course.title}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className="absolute top-3 left-3 rounded-[100px] py-1.5 px-3 bg-[#00000080] border-[0.2px] border-white/80 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
                  {course.isPublished ? "Published" : "Draft"}
                </span>
                <button
                  type="button"
                  onClick={() => remove(course)}
                  disabled={deletingId === course._id}
                  aria-label={`Delete ${course.title}`}
                  title="Delete course"
                  className="absolute top-3 right-3 grid place-items-center size-8 rounded-full bg-[#00000080] border-[0.2px] border-white/80 text-white cursor-pointer hover:bg-red-600 disabled:opacity-60"
                >
                  {deletingId === course._id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </aside>

              <aside className="px-4 sm:px-5 py-4 flex flex-col gap-2 flex-1">
                <p className="text-base sm:text-lg font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                  {course.title}
                </p>
                <p className="text-xs sm:text-sm leading-[150%] text-subtle-text line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                  <p className="text-base font-semibold text-black-others">
                    {courseAdminPrice(course)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublish(course._id)}
                      disabled={pendingId === course._id}
                      className={`flex items-center gap-1.5 rounded-[8px] text-sm font-medium px-4 py-2 cursor-pointer disabled:opacity-60 ${
                        course.isPublished
                          ? "border border-gray-1 text-subtle-text hover:bg-gray-100"
                          : "border border-primary-100 text-primary-100 hover:bg-primary-10"
                      }`}
                    >
                      {pendingId === course._id && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/admin-courses/upload-course?id=${course._id}`}
                      className="rounded-[8px] bg-black text-white text-sm font-medium px-5 py-2 cursor-pointer hover:bg-black/85"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                <Link
                  href={`/admin-courses/${course._id}/content`}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-[8px] border border-gray-1 text-sm font-medium text-black-others py-2 cursor-pointer hover:bg-gray-100"
                >
                  <ListVideo size={15} /> Manage Content
                </Link>
              </aside>
            </div>
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </section>
  );
}
