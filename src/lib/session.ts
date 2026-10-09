import { cookies } from "next/headers";
import type { AuthTokens, User } from "@/types/api";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const PROFILE_COOKIE = "profile";

export const ACCESS_TOKEN_MAX_AGE = 60 * 15;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function setSession(tokens: AuthTokens): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  store.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

// --- Display profile ------------------------------------------------------
// Cached display fields only. Authorization is verified by the backend; see
// lib/current-user.ts. Never use this unsigned cookie for access decisions.

export async function setProfile(user: User): Promise<void> {
  const store = await cookies();
  const profile = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    isActive: user.isActive,
    // Collected at signup since 2026-08-12 and editable from Settings, so they have to
    // survive the round-trip — otherwise the form renders them blank and a save would
    // silently wipe them.
    telegramUsername: user.telegramUsername,
    examSitting: user.examSitting,
  };
  store.set(PROFILE_COOKIE, JSON.stringify(profile), {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function getProfile(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get(PROFILE_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function clearProfile(): Promise<void> {
  const store = await cookies();
  store.delete(PROFILE_COOKIE);
}
