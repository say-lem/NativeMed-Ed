import { z } from "zod";
import type { UpdateHomepageStatsInput, YoutubeLinkInput } from "@/types/api";

const wholeNumberField = z
  .string()
  .trim()
  .regex(/^\d+$/, "Must be a whole non-negative number");

/** Mirrors the backend's Zod rules for PATCH /admin/homepage. `contactEmail`/`contactPhone`
 *  are blank-allowed here — an empty value is omitted from the payload rather than sent,
 *  so leaving them blank never overwrites an already-set value with an invalid one. */
export const homepageStatsSchema = z.object({
  testimonialsCount: wholeNumberField,
  registrarsCount: wholeNumberField,
  contactEmail: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email"),
  contactPhone: z
    .string()
    .trim()
    .refine((v) => v === "" || v.length >= 7, "Phone must be at least 7 characters"),
});

export type HomepageStatsValues = z.infer<typeof homepageStatsSchema>;

export function homepageStatsPayload(
  values: HomepageStatsValues,
): UpdateHomepageStatsInput {
  return {
    testimonialsCount: Number(values.testimonialsCount),
    registrarsCount: Number(values.registrarsCount),
    contactEmail: values.contactEmail === "" ? undefined : values.contactEmail,
    contactPhone: values.contactPhone === "" ? undefined : values.contactPhone,
  };
}

/** Mirrors the backend's Zod rules for the youtube-links admin endpoints. */
export const youtubeLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  url: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .regex(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//, "Must be a YouTube link"),
  order: z.string().trim().regex(/^$|^\d+$/, "Order must be a whole non-negative number"),
});

export type YoutubeLinkValues = z.infer<typeof youtubeLinkSchema>;

export const emptyYoutubeLinkValues: YoutubeLinkValues = {
  title: "",
  url: "",
  order: "",
};

export function youtubeLinkPayload(values: YoutubeLinkValues): YoutubeLinkInput {
  return {
    title: values.title,
    url: values.url,
    order: values.order === "" ? undefined : Number(values.order),
  };
}

/** Mirrors the backend's Zod rules for PATCH /admin/homepage/{terms,legal-disclaimer}. */
export const legalPageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(20000, "Content must be 20000 characters or fewer"),
});

export type LegalPageValues = z.infer<typeof legalPageSchema>;
