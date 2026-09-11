import { z } from "zod";
import type { CreateLinkFreeProductInput, FreeProductType, UpdateFreeProductInput } from "@/types/api";

const orderField = z
  .string()
  .trim()
  .regex(/^$|^\d+$/, "Order must be a whole non-negative number");

/** Mirrors the backend's Zod rules for POST /admin/free-products (creates a `link` product). */
export const freeProductLinkSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
  fileUrl: z.string().trim().url("Must be a valid URL"),
  order: orderField,
});

export type FreeProductLinkValues = z.infer<typeof freeProductLinkSchema>;

export const emptyFreeProductLinkValues: FreeProductLinkValues = {
  title: "",
  description: "",
  fileUrl: "",
  order: "",
};

export function freeProductLinkPayload(
  values: FreeProductLinkValues,
): CreateLinkFreeProductInput {
  return {
    title: values.title,
    description: values.description,
    fileUrl: values.fileUrl,
    order: values.order === "" ? undefined : Number(values.order),
  };
}

/**
 * Mirrors PATCH /admin/free-products/:id. `fileUrl` is only ever sent for `link` products
 * and `content` only for `blog` products (the caller passes the product's `type` to
 * `freeProductEditPayload`) — the backend 400s otherwise. Description is omitted entirely
 * when blank rather than sent as "" — the backend requires >=5 chars *if* provided, but
 * blog products can genuinely have none.
 */
export const freeProductEditSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z.string().trim().max(2000, "Description must be 2000 characters or fewer"),
  fileUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  content: z.string().trim().max(20000, "Content must be 20000 characters or fewer"),
  order: orderField,
});

export type FreeProductEditValues = z.infer<typeof freeProductEditSchema>;

export function freeProductEditPayload(
  values: FreeProductEditValues,
  type: FreeProductType,
): UpdateFreeProductInput {
  const payload: UpdateFreeProductInput = {
    title: values.title,
    order: values.order === "" ? undefined : Number(values.order),
  };
  if (values.description.trim() !== "") payload.description = values.description;
  if (type === "link" && values.fileUrl) payload.fileUrl = values.fileUrl;
  if (type === "blog") payload.content = values.content;
  return payload;
}
