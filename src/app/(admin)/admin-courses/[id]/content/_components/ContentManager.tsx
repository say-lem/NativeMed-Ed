"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ExternalLink,
  FileText,
  GripVertical,
  Loader2,
  Music,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import type { Lesson } from "@/types/api";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import LessonEditModal from "./LessonEditModal";
import {
  addDriveLessonAction,
  addPdfLessonAction,
  deleteLessonAction,
  reorderLessonsAction,
  updateLessonAction,
} from "../actions";

const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

type Kind = "pdf" | "video" | "audio";

const KIND_META: Record<Kind, { label: string; icon: typeof FileText }> = {
  pdf: { label: "PDF", icon: FileText },
  video: { label: "Video (Drive link)", icon: Video },
  audio: { label: "Audio (Drive link)", icon: Music },
};

function typeOf(type: string): Kind {
  const t = type?.toLowerCase();
  return t === "video" || t === "audio" ? t : "pdf";
}

function TypeBadge({ type }: { type: string }) {
  const kind = typeOf(type);
  const { icon: Icon, label } = KIND_META[kind];
  const cls =
    kind === "video"
      ? "bg-[#EEF2FF] text-[#3538CD]"
      : kind === "audio"
        ? "bg-[#F3E8FF] text-[#7E22CE]"
        : "bg-[#FFF4E5] text-[#B25E09]";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-[2px] rounded-full text-xs font-semibold ${cls}`}>
      <Icon size={12} />
      {label.split(" ")[0]}
    </span>
  );
}

/** "mm:ss" ↔ seconds — the backend stores duration in seconds, but that's an unfriendly
 *  unit for an admin to type directly. */
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

export default function ContentManager({
  courseId,
  lessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [adding, startAdd] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startDelete] = useTransition();
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [savingEdit, startEdit] = useTransition();
  const [reordering, startReorder] = useTransition();

  const byOrder = (a: Lesson, b: Lesson) => (a.order ?? 0) - (b.order ?? 0);

  // Local, drag-reorderable copy; re-synced (render-phase) when server data
  // changes. Drag updates `items` optimistically without refreshing, so the
  // key stays stable and the optimistic order is preserved until a real refetch.
  const [items, setItems] = useState<Lesson[]>(() =>
    [...lessons].sort(byOrder),
  );
  const lessonsKey = lessons.map((l) => `${l._id}:${l.order ?? 0}`).join(",");
  const [prevKey, setPrevKey] = useState(lessonsKey);
  if (lessonsKey !== prevKey) {
    setPrevKey(lessonsKey);
    setItems([...lessons].sort(byOrder));
  }

  const nextOrder = items.reduce((m, l) => Math.max(m, l.order ?? 0), 0) + 1;

  const dragIndex = useRef<number | null>(null);

  const onDrop = (targetIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;

    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(targetIndex, 0, moved);
    const renumbered = next.map((l, idx) => ({ ...l, order: idx + 1 }));

    const changed = renumbered
      .filter((l) => items.find((o) => o._id === l._id)?.order !== l.order)
      .map((l) => ({ id: l._id, order: l.order as number }));

    setItems(renumbered); // optimistic
    if (!changed.length) return;
    startReorder(async () => {
      const res = await reorderLessonsAction(courseId, changed);
      if (!res.ok) {
        toast.error(res.message ?? "Couldn't save the new order");
        router.refresh(); // revert to server truth
      }
    });
  };

  const [kind, setKind] = useState<Kind>("pdf");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [duration, setDuration] = useState("");

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setFileUrl("");
    setDuration("");
  };

  const add = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const ord = nextOrder; // always append at the end; reorder by dragging
    startAdd(async () => {
      let res;
      if (kind === "pdf") {
        if (!file) {
          toast.error("Choose a PDF file");
          return;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("title", title.trim());
        fd.append("order", String(ord));
        res = await addPdfLessonAction(courseId, fd);
      } else {
        if (!fileUrl.trim()) {
          toast.error("Add the Drive link");
          return;
        }
        res = await addDriveLessonAction(courseId, {
          title: title.trim(),
          type: kind,
          fileUrl: fileUrl.trim(),
          order: ord,
          duration: parseDuration(duration),
        });
      }
      if (res.ok) {
        toast.success(res.message ?? "Lesson added");
        resetForm();
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const saveEdit = (payload: { title: string; duration?: number }) => {
    if (!editing) return;
    const id = editing._id;
    startEdit(async () => {
      const res = await updateLessonAction(courseId, id, payload);
      if (res.ok) {
        toast.success(res.message ?? "Lesson updated");
        setEditing(null);
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const remove = async (l: Lesson) => {
    const ok = await confirm({
      title: "Delete lesson?",
      message: `"${l.title}" will be permanently removed.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setDeletingId(l._id);
    startDelete(async () => {
      const res = await deleteLessonAction(courseId, l._id);
      if (res.ok) toast.success(res.message ?? "Lesson deleted");
      else toast.error(res.message ?? "Something went wrong");
      setDeletingId(null);
      router.refresh();
    });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-12 flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* Add lesson */}
      <div className="p-4 sm:p-6 border-[0.5px] border-[#B7B7B9] rounded-[12px]">
        <h2 className="text-lg font-semibold text-black-others">Add Lesson</h2>

        {/* Type toggle */}
        <div className="mt-4 inline-flex flex-wrap rounded-[8px] border border-[#EDEDED] p-1 bg-gray-50">
          {(Object.keys(KIND_META) as Kind[]).map((k) => {
            const { label, icon: Icon } = KIND_META[k];
            return (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-sm font-medium cursor-pointer ${
                  kind === k
                    ? "bg-white shadow-sm text-primary-100"
                    : "text-subtle-text"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm text-[#080A0D]">Lesson Title</label>
            <input
              className={fieldClass}
              placeholder="e.g., Introduction to the SCA exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {kind === "pdf" ? (
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-[#080A0D]">PDF File</label>
              <label className="flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 cursor-pointer">
                <span className="text-sm text-subtle-text truncate">
                  {file ? file.name : "Choose a PDF file"}
                </span>
                <Upload size={16} className="text-primary-100 shrink-0" />
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm text-[#080A0D]">
                  Google-Drive Link
                </label>
                <input
                  className={fieldClass}
                  placeholder="https://drive.google.com/…"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
              </div>
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
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-subtle-text">
          New lessons are added at the end. Drag lessons below to reorder them.
        </p>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={add}
            disabled={adding}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-primary-100 text-white cursor-pointer disabled:opacity-60"
          >
            {adding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Add Lesson
          </button>
        </div>
      </div>

      {/* Lessons list */}
      <div>
        <h2 className="text-lg font-semibold text-black-others mb-4 flex items-center gap-2">
          Lessons{" "}
          <span className="text-subtle-text font-normal">({items.length})</span>
          {reordering && (
            <span className="inline-flex items-center gap-1 text-xs font-normal text-subtle-text">
              <Loader2 size={12} className="animate-spin" /> saving order…
            </span>
          )}
        </h2>

        {items.length === 0 ? (
          <p className="text-center text-subtle-text py-12 border border-dashed border-[#E0E0E0] rounded-[12px]">
            No lessons yet. Add one above to get started.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((l, i) => (
              <li
                key={l._id}
                draggable
                onDragStart={() => (dragIndex.current = i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(i)}
                className="flex items-center gap-3 sm:gap-4 border border-[#EDEDED] rounded-[12px] px-3 sm:px-5 py-4 bg-white"
              >
                <span
                  className="shrink-0 text-[#B7B7B9] cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                  aria-hidden
                >
                  <GripVertical size={18} />
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-10 text-primary-100 text-sm font-semibold">
                  {l.order ?? "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-black-others truncate">
                    {l.title}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    <TypeBadge type={l.type} />
                    {l.duration != null && (
                      <span className="text-xs text-subtle-text">
                        {formatDuration(l.duration)}
                      </span>
                    )}
                  </div>
                </div>
                {l.fileUrl && (
                  <a
                    href={l.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 text-sm text-primary-100 hover:underline"
                  >
                    Open <ExternalLink size={14} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setEditing(l)}
                  aria-label={`Edit ${l.title}`}
                  title="Edit lesson"
                  className="shrink-0 p-2 rounded-md text-subtle-text hover:bg-gray-100 cursor-pointer"
                >
                  <Pencil size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(l)}
                  disabled={deletingId === l._id}
                  aria-label={`Delete ${l.title}`}
                  title="Delete lesson"
                  className="shrink-0 p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-60"
                >
                  {deletingId === l._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <LessonEditModal
          lesson={editing}
          saving={savingEdit}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </section>
  );
}
