import { z } from "zod";
import type { AdminCourse, CourseInput, CoursePricing } from "@/types/api";

export const CATEGORIES = ["Course", "Session", "Webinar"];
export const PAYMENT_TYPES = ["One-time", "Subscription", "Free"];

/** Money input: optional, but must look like a price when filled. Kept as a string so an
 *  empty field means "this interval isn't offered" rather than 0. */
const priceField = z
  .string()
  .trim()
  .regex(/^(£?\s*\d+(\.\d{1,2})?)?$/, "Enter a valid price (e.g. 19.99)");

/** The backend accepts a raw folder ID or any Drive URL form (/drive/folders/<id>,
 *  /file/d/<id>/view, /open?id=<id>) and extracts the ID itself. We only reject input
 *  that clearly isn't either, so we don't out-guess the backend's parser.
 *
 *  `required` is false on **edit**: an admin may leave the link blank to keep the stored
 *  folder (`buildCoursePayload` omits empty fields from the PATCH). Admin GETs return the
 *  link, so it normally arrives prefilled. */
const driveField = (required: boolean) =>
  z
    .string()
    .trim()
    .refine((v) => !required || v.length > 0, "Drive folder link is required")
    .refine(
      (v) =>
        v === "" ||
        (!/\s/.test(v) &&
          (/^[A-Za-z0-9_-]{10,}$/.test(v) || /^https?:\/\//.test(v))),
      "Paste a Google Drive folder link, or the folder ID on its own",
    );

/** Optional community invite link — emailed (and shown publicly) once set. Blank keeps
 *  whatever is stored on edit. */
const channelField = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Must be a valid URL");

/**
 * Pricing is flat — courses no longer have access tiers, just one Drive folder and one
 * price per interval. At least one of monthly/quarterly is required on create; on edit
 * both blank keeps whatever is stored.
 */
export function makeCourseSchema(mode: "create" | "edit") {
  const isCreate = mode === "create";

  return z
    .object({
      title: z.string().trim().min(3, "Title must be at least 3 characters"),
      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters"),
      // Optional — blank means the detail page shows no separate write-up (just the short
      // description). The backend only enforces the 10-char minimum once something's typed.
      detailedDescription: z
        .string()
        .trim()
        .refine(
          (v) => v === "" || v.length >= 10,
          "Detailed description must be at least 10 characters",
        ),
      monthlyPrice: priceField,
      quarterlyPrice: priceField,
      driveFolderId: driveField(isCreate),
      telegramChannel: channelField,
      whatsappChannel: channelField,
    })
    .superRefine((v, ctx) => {
      if (isCreate && v.monthlyPrice === "" && v.quarterlyPrice === "") {
        ctx.addIssue({
          code: "custom",
          path: ["monthlyPrice"],
          message: "Set a monthly or quarterly price",
        });
      }
    });
}

/** Create-mode schema (Drive link + at least one price required). */
export const courseSchema = makeCourseSchema("create");

export type CourseFormValues = z.infer<typeof courseSchema>;

export const emptyCourseValues: CourseFormValues = {
  title: "",
  description: "",
  detailedDescription: "",
  monthlyPrice: "",
  quarterlyPrice: "",
  driveFolderId: "",
  telegramChannel: "",
  whatsappChannel: "",
};

const toStr = (n?: number) => (n != null ? String(n) : "");

/** Prefill for edit. The Drive link + community channels come back on admin GETs. */
export function courseToFormValues(c: AdminCourse): CourseFormValues {
  return {
    title: c.title ?? "",
    description: c.description ?? "",
    detailedDescription: c.detailedDescription ?? "",
    monthlyPrice: toStr(c.pricing?.monthly),
    quarterlyPrice: toStr(c.pricing?.quarterly),
    driveFolderId: c.driveFolderId ?? "",
    telegramChannel: c.telegramChannel ?? "",
    whatsappChannel: c.whatsappChannel ?? "",
  };
}

const parsePrice = (v: string): number | undefined => {
  const s = v.replace(/£/g, "").trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

/** Build the API payload. Empty price → interval omitted (not offered). No prices at all
 *  → `pricing` key omitted, so a PATCH merge keeps the stored values. Empty Drive
 *  link/channel → omitted, same reason. */
export function buildCoursePayload(v: CourseFormValues): CourseInput {
  const payload: CourseInput = {
    title: v.title.trim(),
    description: v.description.trim(),
  };

  const detailedDescription = v.detailedDescription.trim();
  if (detailedDescription) payload.detailedDescription = detailedDescription;

  const pricing: CoursePricing = {};
  const monthly = parsePrice(v.monthlyPrice);
  const quarterly = parsePrice(v.quarterlyPrice);
  if (monthly != null) pricing.monthly = monthly;
  if (quarterly != null) pricing.quarterly = quarterly;
  if (Object.keys(pricing).length > 0) payload.pricing = pricing;

  const driveFolderId = v.driveFolderId.trim();
  if (driveFolderId) payload.driveFolderId = driveFolderId;

  const telegramChannel = v.telegramChannel.trim();
  if (telegramChannel) payload.telegramChannel = telegramChannel;

  const whatsappChannel = v.whatsappChannel.trim();
  if (whatsappChannel) payload.whatsappChannel = whatsappChannel;

  return payload;
}
