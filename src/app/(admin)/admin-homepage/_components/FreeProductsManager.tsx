"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { uploadPdfDirect } from "@/lib/pdf-upload";
import type { FreeProduct } from "@/types/api";
import FreeProductEditModal from "./FreeProductEditModal";
import {
  addBlogFreeProductAction,
  addLinkFreeProductAction,
  addPdfFreeProductAction,
  deleteFreeProductAction,
  getFreeProductPdfSignatureAction,
  setFreeProductPublishedAction,
} from "../actions";

const fieldClass =
  "border-[0.5px] rounded-[8px] px-4 py-2.5 border-secondary-20 w-full outline-none focus:border-primary-100 text-black-others";

type Kind = "link" | "pdf" | "blog";

const KIND_LABEL: Record<Kind, string> = {
  link: "External Link",
  pdf: "PDF Upload",
  blog: "Blog Post",
};

const TYPE_BADGE: Record<FreeProduct["type"], string> = {
  link: "Link",
  pdf: "PDF",
  blog: "Blog",
};

export default function FreeProductsManager({ products }: { products: FreeProduct[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<FreeProduct | null>(null);
  const [adding, startAdd] = useTransition();
  const [, startAction] = useTransition();

  const [kind, setKind] = useState<Kind>("link");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [order, setOrder] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setFileUrl("");
    setFile(null);
    setCoverImage(null);
    setOrder("");
  };

  const add = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (kind !== "blog" && description.trim().length < 5) {
      toast.error("Description must be at least 5 characters");
      return;
    }

    startAdd(async () => {
      let res;
      if (kind === "link") {
        if (!fileUrl.trim()) {
          toast.error("Add the product URL");
          return;
        }
        res = await addLinkFreeProductAction({
          title: title.trim(),
          description: description.trim(),
          fileUrl: fileUrl.trim(),
          order: order || "",
        });
      } else if (kind === "pdf") {
        if (!file) {
          toast.error("Choose a PDF file");
          return;
        }
        const sig = await getFreeProductPdfSignatureAction();
        if (!sig.ok || !sig.data) {
          toast.error(sig.message ?? "Couldn't start the upload");
          return;
        }
        let uploaded: { secure_url: string; public_id: string };
        try {
          uploaded = await uploadPdfDirect(file, sig.data);
        } catch {
          toast.error("PDF upload failed");
          return;
        }
        res = await addPdfFreeProductAction({
          title: title.trim(),
          description: description.trim(),
          fileUrl: uploaded.secure_url,
          publicId: uploaded.public_id,
          order: Number(order || 0),
        });
      } else {
        if (!coverImage) {
          toast.error("Choose a cover image");
          return;
        }
        if (content.trim().length < 20) {
          toast.error("Content must be at least 20 characters");
          return;
        }
        const fd = new FormData();
        fd.append("coverImage", coverImage);
        fd.append("title", title.trim());
        fd.append("content", content.trim());
        if (description.trim()) fd.append("description", description.trim());
        fd.append("order", order || "0");
        res = await addBlogFreeProductAction(fd);
      }
      if (res.ok) {
        toast.success(res.message ?? "Product added");
        resetForm();
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  };

  const togglePublished = (product: FreeProduct) => {
    setBusyId(product._id);
    startAction(async () => {
      const res = await setFreeProductPublishedAction(product._id, !product.isPublished);
      if (res.ok) toast.success(res.message ?? "Updated");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = async (product: FreeProduct) => {
    const ok = await confirm({
      title: "Delete product?",
      message: `"${product.title}" will be permanently removed.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(product._id);
    startAction(async () => {
      const res = await deleteFreeProductAction(product._id);
      if (res.ok) toast.success(res.message ?? "Product deleted");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const sorted = [...products].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-black-others">Add Free Product</h2>

        <div className="mt-4 inline-flex flex-wrap rounded-[8px] border border-[#EDEDED] p-1 bg-gray-50">
          {(["link", "pdf", "blog"] as Kind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-sm font-medium cursor-pointer ${
                kind === k ? "bg-white shadow-sm text-primary-100" : "text-subtle-text"
              }`}
            >
              {k === "link" && <Link2 size={15} />}
              {k === "pdf" && <FileText size={15} />}
              {k === "blog" && <BookOpen size={15} />}
              {KIND_LABEL[k]}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm text-[#080A0D]">Title</label>
            <input
              className={fieldClass}
              placeholder="Free SCA Revision Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm text-[#080A0D]">
              Description {kind === "blog" && <span className="text-subtle-text">(optional)</span>}
            </label>
            <textarea
              rows={3}
              className={`${fieldClass} resize-y`}
              placeholder={
                kind === "blog"
                  ? "Optional short excerpt shown above the content"
                  : "A short summary of what candidates get"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {kind === "link" && (
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-[#080A0D]">External URL</label>
              <input
                className={fieldClass}
                placeholder="https://drive.google.com/…"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />
            </div>
          )}

          {kind === "pdf" && (
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
          )}

          {kind === "blog" && (
            <>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-[#080A0D]">Cover Image</label>
                <label className="flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 cursor-pointer">
                  <span className="text-sm text-subtle-text truncate">
                    {coverImage ? coverImage.name : "Choose a cover image"}
                  </span>
                  <Upload size={16} className="text-primary-100 shrink-0" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-[#080A0D]">Content</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write the blog post..."
                />
              </div>
            </>
          )}

          {(kind === "pdf" || kind === "blog") && (
            <div className="space-y-2">
              <label className="block text-sm text-[#080A0D]">
                Order <span className="text-subtle-text">(optional)</span>
              </label>
              <input
                className={fieldClass}
                inputMode="numeric"
                placeholder="0"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="text-right mt-5">
          <button
            type="button"
            onClick={add}
            disabled={adding}
            className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer disabled:opacity-60"
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {adding ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-black-others">
          Free products ({products.length})
        </h2>

        <div className="mt-5 divide-y divide-[#EDEDED]">
          {sorted.length === 0 ? (
            <p className="text-center text-subtle-text py-10">No free products yet.</p>
          ) : (
            sorted.map((product) => {
              const busy = busyId === product._id;
              return (
                <div
                  key={product._id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {product.type === "blog" && product.coverImageUrl && (
                      <Image
                        src={product.coverImageUrl}
                        alt=""
                        width={56}
                        height={40}
                        className="size-10 rounded-[6px] object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-black-others truncate">
                          {product.title}
                        </p>
                        <span className="rounded-full bg-primary-10 px-2 py-0.5 text-xs text-primary-100">
                          {TYPE_BADGE[product.type]}
                        </span>
                        {!product.isPublished && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-subtle-text">
                            Draft
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-xs text-subtle-text line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                      )}
                      {product.type !== "blog" && product.fileUrl && (
                        <a
                          href={product.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-100 hover:underline break-all inline-flex items-center gap-1 mt-0.5"
                        >
                          <ExternalLink size={11} />
                          {product.type === "pdf" ? "Download" : "View link"}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePublished(product)}
                      disabled={busy}
                      className="rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {product.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(product)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(product)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {busy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {editing && (
        <FreeProductEditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
