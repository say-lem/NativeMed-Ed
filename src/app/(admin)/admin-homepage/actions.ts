"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  addFaq,
  addYoutubeLink,
  deleteFaq,
  deleteYoutubeLink,
  updateFaq,
  updateFounderBio,
  updateFounderImage,
  updateHomepageStats,
  updateLegalDisclaimer,
  updatePrivacyPolicy,
  updateTermsAndConditions,
  updateYoutubeLink,
} from "@/services/homepage.service";
import {
  createLinkFreeProduct,
  deleteFreeProduct,
  replaceFreeProductCoverImage,
  setFreeProductPublished,
  updateFreeProduct,
  uploadBlogFreeProduct,
  uploadPdfFreeProduct,
} from "@/services/freeProducts.service";
import {
  homepageStatsSchema,
  homepageStatsPayload,
  type HomepageStatsValues,
  youtubeLinkSchema,
  youtubeLinkPayload,
  type YoutubeLinkValues,
  legalPageSchema,
  type LegalPageValues,
  founderBioSchema,
  type FounderBioValues,
  faqSchema,
  faqPayload,
  type FaqValues,
} from "@/lib/schemas/homepage";
import {
  freeProductLinkSchema,
  freeProductLinkPayload,
  type FreeProductLinkValues,
  freeProductEditSchema,
  freeProductEditPayload,
  type FreeProductEditValues,
} from "@/lib/schemas/freeProducts";
import type { ApiFailure, FormActionResult, FreeProductType } from "@/types/api";

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
// Legal pages — terms & conditions, legal disclaimer
// ─────────────────────────────────────────────────────────────────────────────

export async function updateTermsAndConditionsAction(
  values: LegalPageValues,
): Promise<FormActionResult> {
  const parsed = legalPageSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateTermsAndConditions(parsed.data.content);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-homepage");
    revalidatePath("/terms-and-conditions");
    return { ok: true, message: "Terms and conditions updated" };
  } catch (err) {
    return fail(err, "updateTermsAndConditionsAction", "Couldn't update the terms and conditions.");
  }
}

export async function updateLegalDisclaimerAction(
  values: LegalPageValues,
): Promise<FormActionResult> {
  const parsed = legalPageSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateLegalDisclaimer(parsed.data.content);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-homepage");
    revalidatePath("/legal-disclaimer");
    return { ok: true, message: "Legal disclaimer updated" };
  } catch (err) {
    return fail(err, "updateLegalDisclaimerAction", "Couldn't update the legal disclaimer.");
  }
}

export async function updatePrivacyPolicyAction(
  values: LegalPageValues,
): Promise<FormActionResult> {
  const parsed = legalPageSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updatePrivacyPolicy(parsed.data.content);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-homepage");
    revalidatePath("/privacy-policy");
    return { ok: true, message: "Privacy policy updated" };
  } catch (err) {
    return fail(err, "updatePrivacyPolicyAction", "Couldn't update the privacy policy.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// About the Founder
// ─────────────────────────────────────────────────────────────────────────────

export async function updateFounderBioAction(
  values: FounderBioValues,
): Promise<FormActionResult> {
  const parsed = founderBioSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateFounderBio(parsed.data);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-homepage");
    revalidatePath("/about");
    return { ok: true, message: "Founder's bio updated" };
  } catch (err) {
    return fail(err, "updateFounderBioAction", "Couldn't update the founder's bio.");
  }
}

/** PATCH /admin/homepage/founder-bio/image — the photo shown next to the founder's bio. */
export async function updateFounderImageAction(formData: FormData): Promise<FormActionResult> {
  try {
    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Please choose an image." };
    }
    const res = await updateFounderImage(file);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-homepage");
    revalidatePath("/about");
    return { ok: true, message: "Founder's photo updated" };
  } catch (err) {
    return fail(err, "updateFounderImageAction", "Couldn't update the founder's photo.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────────────────────────────────────

export async function addFaqAction(values: FaqValues): Promise<FormActionResult> {
  const parsed = faqSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await addFaq(faqPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateHomepage();
    return { ok: true, message: "FAQ added" };
  } catch (err) {
    return fail(err, "addFaqAction", "Couldn't add the FAQ.");
  }
}

export async function updateFaqAction(
  id: string,
  values: FaqValues,
): Promise<FormActionResult> {
  const parsed = faqSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateFaq(id, faqPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateHomepage();
    return { ok: true, message: "FAQ updated" };
  } catch (err) {
    return fail(err, "updateFaqAction", "Couldn't update the FAQ.");
  }
}

export async function deleteFaqAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteFaq(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidateHomepage();
    return { ok: true, message: "FAQ deleted" };
  } catch (err) {
    return fail(err, "deleteFaqAction", "Couldn't delete the FAQ.");
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
    const res = await createLinkFreeProduct(freeProductLinkPayload(parsed.data));
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

/** Add a `blog` product (multipart) — reads `coverImage`, `title`, `content`, optional
 *  `description`/`order` from formData. */
export async function addBlogFreeProductAction(formData: FormData): Promise<FormActionResult> {
  try {
    const file = formData.get("coverImage");
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const order = Number(formData.get("order") ?? 0);
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Please choose a cover image." };
    }
    if (title.length < 2) return { ok: false, message: "Title is required." };
    if (content.length < 20) {
      return { ok: false, message: "Content must be at least 20 characters." };
    }

    const fd = new FormData();
    fd.set("coverImage", file);
    fd.set("title", title);
    fd.set("content", content);
    if (description) fd.set("description", description);
    fd.set("order", String(order));
    const res = await uploadBlogFreeProduct(fd);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateFreeProducts();
    return { ok: true, message: "Blog post added" };
  } catch (err) {
    return fail(err, "addBlogFreeProductAction", "Couldn't add the blog post.");
  }
}

/** Replace a blog product's cover image (multipart, reads `coverImage` from formData). */
export async function replaceFreeProductCoverImageAction(
  id: string,
  formData: FormData,
): Promise<FormActionResult> {
  try {
    const file = formData.get("coverImage");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Please choose an image." };
    }
    const res = await replaceFreeProductCoverImage(id, file);
    if (!res.success) return { ok: false, message: res.message };
    revalidateFreeProducts();
    return { ok: true, message: "Cover image updated" };
  } catch (err) {
    return fail(err, "replaceFreeProductCoverImageAction", "Couldn't update the cover image.");
  }
}

/** Edit a product's title/description/order (+ fileUrl for `link`, + content for `blog`). */
export async function updateFreeProductAction(
  id: string,
  values: FreeProductEditValues,
  type: FreeProductType,
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
    const res = await updateFreeProduct(id, freeProductEditPayload(parsed.data, type));
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
