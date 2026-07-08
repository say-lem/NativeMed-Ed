"use client";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Course, User } from "@/types/api";
import SearchableSelect from "@/components/shared/SearchableSelect";

export default function GrantAccessModal({
  users,
  courses,
  saving,
  onClose,
  onGrant,
}: {
  users: User[];
  courses: Course[];
  saving: boolean;
  onClose: () => void;
  onGrant: (userId: string, courseId: string) => void;
}) {
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 cursor-default"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-subtle-text hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-black-others">Grant Access</h2>
        <p className="mt-1 text-sm text-subtle-text">
          Manually enroll a user in a course.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-[#080A0D]">User</label>
            <SearchableSelect
              value={userId}
              onChange={setUserId}
              placeholder="Select a user"
              options={users.map((u) => ({
                value: u._id,
                label: u.fullName,
                sublabel: u.email,
              }))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-[#080A0D]">Course</label>
            <SearchableSelect
              value={courseId}
              onChange={setCourseId}
              placeholder="Select a course"
              options={courses.map((c) => ({ value: c._id, label: c.title }))}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-1 px-5 py-2.5 text-sm font-semibold text-black-others hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onGrant(userId, courseId)}
            disabled={saving || !userId || !courseId}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-primary-100 text-white cursor-pointer disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Grant Access
          </button>
        </div>
      </div>
    </div>
  );
}
