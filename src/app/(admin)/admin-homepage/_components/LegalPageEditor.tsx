"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { formatDate } from "@/lib/date";
import type { FormActionResult } from "@/types/api";

export default function LegalPageEditor({
  title,
  initialContent,
  updatedAt,
  action,
}: {
  title: string;
  initialContent: string;
  updatedAt: string | null;
  action: (values: { content: string }) => Promise<FormActionResult>;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (content.trim().length === 0) {
      toast.error("Content is required");
      return;
    }
    startTransition(async () => {
      const res = await action({ content });
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        router.refresh();
      } else {
        toast.error(res.message ?? "Couldn't save.");
      }
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black-others">{title}</h2>
        <p className="text-xs text-subtle-text">
          {updatedAt ? `Last updated ${formatDate(updatedAt)}` : "Never published"}
        </p>
      </div>
      <p className="mt-1 text-sm text-subtle-text">
        This is what renders on the public {title} page.
      </p>

      <div className="mt-4">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder={`Write the ${title.toLowerCase()}...`}
        />
      </div>

      <div className="text-right mt-4">
        <Button
          type="button"
          onClick={save}
          disabled={pending}
          className="bg-black-others font-bold disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
