import { z } from "zod";
import type { FaqInput, UpdateHomepageStatsInput, YoutubeLinkInput } from "@/types/api";

const wholeNumberField = z
  .string()
  .trim()
  .regex(/^\d+$/, "Must be a whole non-negative number");

/** Blank-allowed URL field — mirrors the backend's `socialUrlField` (any valid URL, no
 *  platform-specific pattern check), but permits an empty string so leaving it blank never
 *  overwrites an already-set value with an invalid one. */
const socialUrlField = z
  .string()
  .trim()
  .refine((v) => v === "" || z.string().url().safeParse(v).success, "Must be a valid URL");

/** Mirrors the backend's Zod rules for PATCH /admin/homepage. `contactEmail`/`contactPhone`/
 *  the social links are blank-allowed here — an empty value is omitted from the payload
 *  rather than sent, so leaving them blank never overwrites an already-set value with an
 *  invalid one. */
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
  facebookUrl: socialUrlField,
  whatsappUrl: socialUrlField,
  twitterUrl: socialUrlField,
  instagramUrl: socialUrlField,
  youtubeUrl: socialUrlField,
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
    facebookUrl: values.facebookUrl === "" ? undefined : values.facebookUrl,
    whatsappUrl: values.whatsappUrl === "" ? undefined : values.whatsappUrl,
    twitterUrl: values.twitterUrl === "" ? undefined : values.twitterUrl,
    instagramUrl: values.instagramUrl === "" ? undefined : values.instagramUrl,
    youtubeUrl: values.youtubeUrl === "" ? undefined : values.youtubeUrl,
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

/** Mirrors the backend's Zod rules for PATCH /admin/homepage/{terms,legal-disclaimer}.
 *  40000 (not 20000) — legal documents like the privacy policy routinely run
 *  15-20k characters as markdown, and pasting from Word/Docs can inflate that
 *  further once the rich-text editor re-serializes it; 20000 was cutting real
 *  saves off mid-document. */
export const legalPageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(40000, "Content must be 40000 characters or fewer"),
});

export type LegalPageValues = z.infer<typeof legalPageSchema>;

/** Mirrors the backend's Zod rules for PATCH /admin/homepage/founder-bio. The backend
 *  accepts either field alone, but the admin editor always submits both together. */
export const founderBioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(20000, "Content must be 20000 characters or fewer"),
});

export type FounderBioValues = z.infer<typeof founderBioSchema>;

/** Mirrors the backend's Zod rules for the FAQ admin endpoints. */
export const faqSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(500, "Question must be 500 characters or fewer"),
  answer: z
    .string()
    .trim()
    .min(1, "Answer is required")
    .max(5000, "Answer must be 5000 characters or fewer"),
  order: z.string().trim().regex(/^$|^\d+$/, "Order must be a whole non-negative number"),
});

export type FaqValues = z.infer<typeof faqSchema>;

export const emptyFaqValues: FaqValues = {
  question: "",
  answer: "",
  order: "",
};

export function faqPayload(values: FaqValues): FaqInput {
  return {
    question: values.question,
    answer: values.answer,
    order: values.order === "" ? undefined : Number(values.order),
  };
}
