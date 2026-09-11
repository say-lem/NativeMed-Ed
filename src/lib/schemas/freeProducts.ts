import { z } from "zod";
import type { UpdateFreeProductInput } from "@/types/api";

/** Mirrors the backend's Zod rules for POST /admin/free-products (creates a `link` product). */
export const freeProductLinkSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
  fileUrl: z.string().trim().url("Must be a valid URL"),
});

export type FreeProductLinkValues = z.infer<typeof freeProductLinkSchema>;

export const emptyFreeProductLinkValues: FreeProductLinkValues = {
  title: "",
  description: "",
  fileUrl: "",
};

/**
 * Mirrors PATCH /admin/free-products/:id. `fileUrl` is only ever sent for `link` products
 * (the caller decides via `isLink` in `freeProductEditPayload`) — the backend 400s on it
 * for `pdf` products.
 */
export const freeProductEditSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
  fileUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.string().trim().regex(/^$|^\d+$/, "Order must be a whole non-negative number"),
});

export type FreeProductEditValues = z.infer<typeof freeProductEditSchema>;

export function freeProductEditPayload(
  values: FreeProductEditValues,
  isLink: boolean,
): UpdateFreeProductInput {
  return {
    title: values.title,
    description: values.description,
    order: values.order === "" ? undefined : Number(values.order),
    ...(isLink && values.fileUrl ? { fileUrl: values.fileUrl } : {}),
  };
}
