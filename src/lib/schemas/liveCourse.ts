import { z } from "zod";
import type { AdminLiveCourse, LiveCourseInput } from "@/types/api";

/** Money input: required for live courses (one-time price, not a tiered/optional
 *  subscription) — must look like a price. */
const priceField = z
  .string()
  .trim()
  .regex(/^£?\s*\d+(\.\d{1,2})?$/, "Enter a valid price (e.g. 199.99)");

/** yyyy-mm-dd, as produced by <input type="date">. */
const dateField = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");

/** The backend accepts a raw folder ID or any Drive URL form and extracts the ID itself. */
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

const channelField = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Must be a valid URL");

export function makeLiveCourseSchema(mode: "create" | "edit") {
  const isCreate = mode === "create";

  return z
    .object({
      title: z.string().trim().min(3, "Title must be at least 3 characters"),
      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters"),
      detailedDescription: z
        .string()
        .trim()
        .refine(
          (v) => v === "" || v.length >= 10,
          "Detailed description must be at least 10 characters",
        ),
      price: isCreate ? priceField : priceField.or(z.literal("")),
      startDate: isCreate ? dateField : dateField.or(z.literal("")),
      endDate: isCreate ? dateField : dateField.or(z.literal("")),
      driveFolderId: driveField(isCreate),
      telegramChannel: channelField,
      whatsappChannel: channelField,
    })
    .superRefine((v, ctx) => {
      if (v.startDate && v.endDate && v.endDate <= v.startDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date must be after the start date",
        });
      }
    });
}

export const liveCourseSchema = makeLiveCourseSchema("create");

export type LiveCourseFormValues = z.infer<typeof liveCourseSchema>;

export const emptyLiveCourseValues: LiveCourseFormValues = {
  title: "",
  description: "",
  detailedDescription: "",
  price: "",
  startDate: "",
  endDate: "",
  driveFolderId: "",
  telegramChannel: "",
  whatsappChannel: "",
};

const toDateInput = (iso?: string): string => (iso ? iso.slice(0, 10) : "");
const toStr = (n?: number) => (n != null ? String(n) : "");

export function liveCourseToFormValues(c: AdminLiveCourse): LiveCourseFormValues {
  return {
    title: c.title ?? "",
    description: c.description ?? "",
    detailedDescription: c.detailedDescription ?? "",
    price: toStr(c.price),
    startDate: toDateInput(c.startDate),
    endDate: toDateInput(c.endDate),
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

export function buildLiveCoursePayload(v: LiveCourseFormValues): LiveCourseInput {
  const payload: LiveCourseInput = {
    title: v.title.trim(),
    description: v.description.trim(),
  };

  const detailedDescription = v.detailedDescription.trim();
  if (detailedDescription) payload.detailedDescription = detailedDescription;

  const price = parsePrice(v.price);
  if (price != null) payload.price = price;

  if (v.startDate) payload.startDate = v.startDate;
  if (v.endDate) payload.endDate = v.endDate;

  const driveFolderId = v.driveFolderId.trim();
  if (driveFolderId) payload.driveFolderId = driveFolderId;

  const telegramChannel = v.telegramChannel.trim();
  if (telegramChannel) payload.telegramChannel = telegramChannel;

  const whatsappChannel = v.whatsappChannel.trim();
  if (whatsappChannel) payload.whatsappChannel = whatsappChannel;

  return payload;
}
