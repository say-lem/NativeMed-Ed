"use client";
import { useMemo, useState } from "react";
import SearchBanner from "@/components/shared/SearchBanner";
import LiveCoursesCard from "./LiveCoursesCard";
import type { LiveCourse } from "@/types/api";

export default function LiveCoursesBrowser({
  courses,
  error,
}: {
  courses: LiveCourse[];
  error?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.title, c.description].some((f) => f?.toLowerCase().includes(q)),
    );
  }, [query, courses]);

  return (
    <>
      <SearchBanner
        title="Live Courses"
        placeholder="Search Live Courses..."
        value={query}
        onChange={setQuery}
      />
      {!error && courses.length > 0 && filtered.length === 0 ? (
        <p className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
          No live courses match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <LiveCoursesCard courses={filtered} error={error} />
      )}
    </>
  );
}
