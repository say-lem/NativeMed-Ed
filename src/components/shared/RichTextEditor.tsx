"use client";
import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import type { Editor } from "@tiptap/react";
import {
  Bold as BoldIcon,
  Heading2,
  Italic as ItalicIcon,
  List,
  ListOrdered,
} from "lucide-react";

// tiptap-markdown augments editor.storage but doesn't ship v3 types.
const getMarkdown = (editor: Editor): string =>
  (editor.storage as unknown as { markdown: { getMarkdown: () => string } })
    .markdown.getMarkdown();

const contentStyles =
  "min-h-[110px] px-4 py-3 text-sm text-black-others outline-none " +
  "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 " +
  "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1 [&_a]:text-primary-100 [&_a]:underline";

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  // Distinguishes edits made *here* (skip re-sync) from external value changes.
  const internal = useRef(false);

  const editor = useEditor({
    immediatelyRender: false, // required under Next SSR
    extensions: [
      StarterKit,
      Markdown.configure({ html: false, breaks: true }),
    ],
    content: value || "",
    editorProps: { attributes: { class: contentStyles } },
    onUpdate: ({ editor }) => {
      internal.current = true;
      onChange(getMarkdown(editor));
    },
  });

  // Re-sync when the value changes from outside (prefill on edit, form reset).
  useEffect(() => {
    if (!editor) return;
    if (internal.current) {
      internal.current = false;
      return;
    }
    const current = getMarkdown(editor);
    if ((value || "") !== current) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const btn = (active: boolean) =>
    `grid size-8 place-items-center rounded-md cursor-pointer hover:bg-gray-100 ${
      active ? "bg-primary-10 text-primary-100" : "text-black-others"
    }`;

  return (
    <div className="rounded-[8px] border-[0.5px] border-[#B7B7B9] focus-within:border-primary-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b-[0.5px] border-[#B7B7B9] bg-gray-50 px-2 py-1">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={btn(!!editor?.isActive("bold"))}
          title="Bold"
          aria-label="Bold"
        >
          <BoldIcon size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={btn(!!editor?.isActive("italic"))}
          title="Italic"
          aria-label="Italic"
        >
          <ItalicIcon size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(!!editor?.isActive("heading", { level: 2 }))}
          title="Heading"
          aria-label="Heading"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={btn(!!editor?.isActive("bulletList"))}
          title="Bulleted list"
          aria-label="Bulleted list"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={btn(!!editor?.isActive("orderedList"))}
          title="Numbered list"
          aria-label="Numbered list"
        >
          <ListOrdered size={15} />
        </button>
      </div>

      {/* Editable area */}
      <div className="relative">
        {editor?.isEmpty && placeholder && (
          <span className="pointer-events-none absolute left-4 top-3 text-sm text-[#B7B7B9]">
            {placeholder}
          </span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
