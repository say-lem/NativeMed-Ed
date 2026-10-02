"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { clearSession, clearProfile, getRefreshToken } from "@/lib/session";
import { logout } from "@/services/auth.service";
import { getPdfUploadSignature } from "@/services/uploads.service";
import type { PdfSignatureResult, PdfUploadTarget } from "@/types/api";

export async function logoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      await logout(refreshToken);
    } catch {
      // Backend logout failed — proceed with local clear anyway.
    }
  }
  await clearSession();
  await clearProfile();
  // Home, not /login — a logged-out user has finished, not been kicked out mid-task.
  redirect("/");
}

/** Shared by every admin PDF upload UI (course/live-course content, free resources,
 *  live-course schedule) — issues a signed Cloudinary upload request so the browser can
 *  send the file directly to Cloudinary, never through this server. */
export async function getPdfUploadSignatureAction(
  target: PdfUploadTarget,
): Promise<PdfSignatureResult> {
  try {
    const res = await getPdfUploadSignature(target);
    if (!res.success) return { ok: false, message: res.message };
    return { ok: true, data: res.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[getPdfUploadSignatureAction] axios error:", err.code, err.message);
      return { ok: false, message: "Couldn't start the upload." };
    }
    console.error("[getPdfUploadSignatureAction] unexpected error:", err);
    return { ok: false, message: "Couldn't start the upload." };
  }
}
