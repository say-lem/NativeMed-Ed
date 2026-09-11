import { z } from "zod";
import type { UpdateHomepageStatsInput, YoutubeLinkInput } from "@/types/api";

const wholeNumberField = z
  .string()
  .trim()
  .regex(/^\d+$/, "Must be a whole non-negative number");

/** Mirrors the backend's Zod rules for PATCH /admin/homepage. */
export const homepageStatsSchema = z.object({
  testimonialsCount: wholeNumberField,
  registrarsCount: wholeNumberField,
});

export type HomepageStatsValues = z.infer<typeof homepageStatsSchema>;

export function homepageStatsPayload(
  values: HomepageStatsValues,
): UpdateHomepageStatsInput {
  return {
    testimonialsCount: Number(values.testimonialsCount),
    registrarsCount: Number(values.registrarsCount),
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
