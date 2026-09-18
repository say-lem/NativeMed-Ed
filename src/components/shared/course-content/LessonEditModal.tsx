"use client";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Lesson } from "@/types/api";

const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

function parseDuration(v: string): number | undefined {
  const s = v.trim();
  if (!s) return undefined;
  const parts = s.split(":").map((p) => Number(p));
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return undefined;
  if (parts.length === 1) return Math.round(parts[0]);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return undefined;
}

function formatDuration(seconds?: number): string {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function LessonEditModal({
  lesson,
  saving,
  onClose,
  onSave,
}: {
  lesson: Lesson;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: { title: string; duration?: number }) => void;
}) {
  const type = lesson.type?.toLowerCase();
  const hasDuration = type === "video" || type === "audio";
  const [title, setTitle] = useState(lesson.title ?? "");
  const [duration, setDuration] = useState(formatDuration(lesson.duration));

  const submit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      ...(hasDuration ? { duration: parseDuration(duration) } : {}),
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

          {hasDuration && (
            <div className="space-y-2">
              <label className="block text-sm text-[#080A0D]">
                Duration <span className="text-subtle-text">(optional, mm:ss)</span>
              </label>
              <input
                className={fieldClass}
                placeholder="e.g., 12:30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          )}

          {lesson.fileUrl && (
            <p className="text-xs text-subtle-text">
              The file itself can&apos;t be replaced here — delete this lesson and add a
              new one instead.
            </p>
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
