"use server";

import axios from "axios";
import { contactSchema, type ContactValues } from "@/lib/schemas/contact";
import { sendContactMessage } from "@/services/contact.service";
import type { ApiFailure, FormActionResult } from "@/types/api";

/**
 * Send a contact-form message.
 *
 * The endpoint is public and rate-limited **per IP** via a leaky-bucket queue: roughly 11
 * submissions are accepted per 15 minutes, after which it returns 429. Because our calls go
 * out server-side, that IP is the *server's*, not the visitor's — so on a busy deployment
 * the limit is shared across visitors. Worth watching if the form ever gets heavy use.
 */
export async function sendContactMessageAction(
  values: ContactValues,
): Promise<FormActionResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await sendContactMessage(parsed.data);
    if (!res.success) {
      return { ok: false, message: res.message, fieldErrors: res.errors };
    }
    // 202 = accepted for sending, not delivered. Copy below reflects that.
    return {
      ok: true,
      message: res.message ?? "Thanks — your message is on its way.",
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as ApiFailure | undefined;

      if (status === 429) {
        return {
          ok: false,
          message:
            data?.message ??
            "Too many messages have been sent recently. Please try again in a few minutes.",
        };
      }
      if (data?.message) {
        return { ok: false, message: data.message, fieldErrors: data.errors };
      }
      console.error(
        "[sendContactMessageAction] axios error:",
        status ?? err.code,
        err.message,
      );
      return {
        ok: false,
        message: "Couldn't reach the server. Please try again.",
      };
    }
    console.error("[sendContactMessageAction] unexpected error:", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
