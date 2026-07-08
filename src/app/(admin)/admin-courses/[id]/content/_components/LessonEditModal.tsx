"use client";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Lesson } from "@/types/api";

const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

export default function LessonEditModal({
  lesson,
  saving,
  onClose,
  onSave,
}: {
  lesson: Lesson;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    duration?: string;
    fileUrl?: string;
  }) => void;
}) {
  const isVideo = lesson.type?.toLowerCase() === "video";
  const [title, setTitle] = useState(lesson.title ?? "");
  const [duration, setDuration] = useState(lesson.duration ?? "");
  const [fileUrl, setFileUrl] = useState(lesson.fileUrl ?? "");

  const submit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      ...(isVideo
        ? { duration: duration.trim() || undefined, fileUrl: fileUrl.trim() }
        : {}),
    });
  };

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

        <h2 className="text-lg font-semibold text-black-others">Edit Lesson</h2>

        <div className="mt-5 flex flex-col gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-[#080A0D]">Title</label>
            <input
              className={fieldClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {isVideo && (
            <>
              <div className="space-y-2">
                <label className="block text-sm text-[#080A0D]">
                  Google-Drive Link
                </label>
                <input
                  className={fieldClass}
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-[#080A0D]">
                  Duration <span className="text-subtle-text">(optional)</span>
                </label>
                <input
                  className={fieldClass}
                  placeholder="e.g., 12:30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </>
          )}
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
            onClick={submit}
            disabled={saving}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-primary-100 text-white cursor-pointer disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
