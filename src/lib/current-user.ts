import "server-only";
import { getAccessToken, getProfile } from "@/lib/session";
import { decodeJwt } from "@/lib/jwt";
import type { User } from "@/types/api";

/** Fallback display name when there's no cached profile yet (e.g. an older
 *  session created before the profile cookie existed). */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local || "Account";
}

/**
 * The signed-in user, or null. Built from the **signed JWT** (identity + role —
 * authoritative, backend-issued) plus the **profile cookie** (display fields set
 * at login). Makes **no API call**, so it never hits the `/auth/me` rate limit —
 * this replaced calling `/auth/me` on every layout render.
 *
 * Role gating relies on the JWT only; the profile cookie is display-only.
 * Protected routes are refreshed by the proxy before render, so the access token
 * read here is current.
 */
export async function getSessionUser(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const payload = decodeJwt(token);
  if (!payload) return null;

  const profile = await getProfile();
  return {
    _id: payload._id,
    email: profile?.email ?? payload.email,
    role: payload.role,
    fullName: profile?.fullName ?? nameFromEmail(payload.email),
    phone: profile?.phone ?? "",
    examSitting: profile?.examSitting,
    mustChangePassword: profile?.mustChangePassword ?? false,
    isActive: profile?.isActive,
  };
}

/** Alias used by public/auth pages — same source, named for intent. */
export const getOptionalUser = getSessionUser;
