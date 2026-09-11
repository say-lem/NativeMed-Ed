"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  addYoutubeLink,
  deleteYoutubeLink,
  updateHomepageStats,
  updateYoutubeLink,
} from "@/services/homepage.service";
import {
  createLinkFreeProduct,
  deleteFreeProduct,
  setFreeProductPublished,
  updateFreeProduct,
  uploadPdfFreeProduct,
} from "@/services/freeProducts.service";
import {
  homepageStatsSchema,
  homepageStatsPayload,
  type HomepageStatsValues,
  youtubeLinkSchema,
  youtubeLinkPayload,
  type YoutubeLinkValues,
} from "@/lib/schemas/homepage";
import {
  freeProductLinkSchema,
  type FreeProductLinkValues,
  freeProductEditSchema,
  freeProductEditPayload,
  type FreeProductEditValues,
} from "@/lib/schemas/freeProducts";
import type { ApiFailure, FormActionResult } from "@/types/api";

function fail(err: unknown, tag: string, fallback: string): FormActionResult {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiFailure | undefined;
    console.error(`[${tag}] axios error:`, err.code, err.message);
    return { ok: false, message: data?.message ?? fallback, fieldErrors: data?.errors };
  }
  console.error(`[${tag}] unexpected error:`, err);
  return { ok: false, message: "Something went wrong." };
}

function revalidateHomepage() {
  revalidatePath("/admin-homepage");
  revalidatePath("/");
}

/** testimonialsCount / registrarsCount — caseNumber is always derived, never editable. */
export async function updateHomepageStatsAction(
  values: HomepageStatsValues,
): Promise<FormActionResult> {
  const parsed = homepageStatsSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateHomepageStats(homepageStatsPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateHomepage();
    return { ok: true, message: "Homepage stats updated" };
  } catch (err) {
    return fail(err, "updateHomepageStatsAction", "Couldn't update homepage stats.");
  }
}

export async function addYoutubeLinkAction(
  values: YoutubeLinkValues,
): Promise<FormActionResult> {
  const parsed = youtubeLinkSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await addYoutubeLink(youtubeLinkPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateHomepage();
    return { ok: true, message: "Video added" };
  } catch (err) {
    return fail(err, "addYoutubeLinkAction", "Couldn't add the video.");
  }
}

export async function updateYoutubeLinkAction(
  id: string,
  values: YoutubeLinkValues,
): Promise<FormActionResult> {
  const parsed = youtubeLinkSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateYoutubeLink(id, youtubeLinkPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateHomepage();
    return { ok: true, message: "Video updated" };
  } catch (err) {
    return fail(err, "updateYoutubeLinkAction", "Couldn't update the video.");
  }
}

export async function deleteYoutubeLinkAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteYoutubeLink(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidateHomepage();
    return { ok: true, message: "Video deleted" };
  } catch (err) {
    return fail(err, "deleteYoutubeLinkAction", "Couldn't delete the video.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Free products
// ─────────────────────────────────────────────────────────────────────────────

function revalidateFreeProducts() {
  revalidatePath("/admin-homepage");
  revalidatePath("/free-products");
}

/** Add a `link` product — an external URL to the material. */
export async function addLinkFreeProductAction(
  values: FreeProductLinkValues,
): Promise<FormActionResult> {
  const parsed = freeProductLinkSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await createLinkFreeProduct(parsed.data);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateFreeProducts();
    return { ok: true, message: "Free product added" };
  } catch (err) {
    return fail(err, "addLinkFreeProductAction", "Couldn't add the product.");
  }
}

/** Add a `pdf` product (multipart) — reads `file`, `title`, `description`, `order` from formData. */
export async function addPdfFreeProductAction(formData: FormData): Promise<FormActionResult> {
  try {
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const order = Number(formData.get("order") ?? 0);
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Please choose a PDF file." };
    }
    if (title.length < 2) return { ok: false, message: "Title is required." };
    if (description.length < 5) {
      return { ok: false, message: "Description must be at least 5 characters." };
    }

    const fd = new FormData();
    fd.set("file", file);
    fd.set("title", title);
    fd.set("description", description);
    fd.set("order", String(order));
    const res = await uploadPdfFreeProduct(fd);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateFreeProducts();
    return { ok: true, message: "Free product added" };
  } catch (err) {
    return fail(err, "addPdfFreeProductAction", "Couldn't add the product.");
  }
}

/** Edit a product's title/description/order (+ fileUrl if `isLink`). */
export async function updateFreeProductAction(
  id: string,
  values: FreeProductEditValues,
  isLink: boolean,
): Promise<FormActionResult> {
  const parsed = freeProductEditSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateFreeProduct(id, freeProductEditPayload(parsed.data, isLink));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateFreeProducts();
    return { ok: true, message: "Product updated" };
  } catch (err) {
    return fail(err, "updateFreeProductAction", "Couldn't update the product.");
  }
}

/** Toggle a product's visibility without deleting it. */
export async function setFreeProductPublishedAction(
  id: string,
  isPublished: boolean,
): Promise<FormActionResult> {
  try {
    const res = await setFreeProductPublished(id, isPublished);
    if (!res.success) return { ok: false, message: res.message };
    revalidateFreeProducts();
    return { ok: true, message: isPublished ? "Product published" : "Product unpublished" };
  } catch (err) {
    return fail(err, "setFreeProductPublishedAction", "Couldn't change visibility.");
  }
}

/** Permanently delete a product. */
export async function deleteFreeProductAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteFreeProduct(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidateFreeProducts();
    return { ok: true, message: "Product deleted" };
  } catch (err) {
    return fail(err, "deleteFreeProductAction", "Couldn't delete the product.");
  }
}
