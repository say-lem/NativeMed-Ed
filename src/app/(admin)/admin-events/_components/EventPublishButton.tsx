"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Activity } from "@/types/api";
import { setActivityPublishedAction } from "../actions";

export default function EventPublishButton({ event, disabled = false }: { event: Activity; disabled?: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const published = event.isPublished !== false;
  return (
    <button
      type="button"
      disabled={disabled || pending}
      aria-label={`${published ? "Unpublish" : "Publish"} event: ${event.activityStatus || event.description}`}
      onClick={() => startTransition(async () => {
        try {
          const res = await setActivityPublishedAction(event._id, !published);
          if (res.ok) {
            toast.success(res.message);
            router.refresh();
          } else toast.error(res.message ?? "Couldn't change event visibility.");
        } catch {
          toast.error("Couldn't change event visibility.");
        }
      })}
      className="flex shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-primary-100 text-primary-100 hover:bg-primary-10 text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : published ? <Archive size={12} /> : <Upload size={12} />}
      {pending ? "Saving..." : published ? "Unpublish" : "Publish"}
    </button>
  );
}
