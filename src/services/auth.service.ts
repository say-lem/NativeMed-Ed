import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  AuthSuccessData,
  AuthTokens,
  User,
} from "@/types/api";
import type {
  LoginValues,
  RegisterValues,
  ForgotPasswordValues,
  ResetPasswordValues,
} from "@/lib/schemas/auth";

export async function login(
  payload: LoginValues,
): Promise<ApiResponse<AuthSuccessData>> {
  const res = await api.post<ApiResponse<AuthSuccessData>>(
    "/auth/login",
    payload,
  );
  return res.data;
}

export async function register(
  payload: RegisterValues,
): Promise<ApiResponse<AuthSuccessData>> {
  const res = await api.post<ApiResponse<AuthSuccessData>>(
    "/auth/register",
    payload,
  );
  return res.data;
}

/** POST /auth/forgot-password — always returns a generic success message,
 *  regardless of whether the email is registered (avoids account enumeration). */
export async function forgotPassword(
  payload: ForgotPasswordValues,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>(
    "/auth/forgot-password",
    payload,
  );
  return res.data;
}

/** POST /auth/reset-password — `token` comes from the emailed reset link.
 *  A bad/expired token comes back as a plain `400` (no `errors` field), unlike
 *  field validation which is `422` with `errors`. */
export async function resetPassword(
  payload: ResetPasswordValues,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>("/auth/reset-password", {
    token: payload.token,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });
  return res.data;
}

export async function refresh(
  refreshToken: string,
): Promise<ApiResponse<AuthTokens>> {
  const res = await api.post<ApiResponse<AuthTokens>>("/auth/refresh-token", {
    refreshToken,
  });
  return res.data;
}

export async function logout(refreshToken: string): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>("/auth/logout", {
    refreshToken,
  });
  return res.data;
}

export async function me(): Promise<ApiResponse<User>> {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data;
}

/**
 * PATCH /auth/me — update the signed-in user's profile.
 *
 * `examSitting` is validated as strict `MM/YY` **when present**, so an empty string is
 * stripped rather than sent — accounts created before 2026-08-12 have no exam sitting, and
 * sending `""` would 422 a save that only changed the user's name.
 */
export async function updateProfile(payload: {
  fullName?: string;
  phone?: string;
  telegramUsername?: string;
  examSitting?: string;
}): Promise<ApiResponse<User>> {
  // Drop empty optionals rather than sending "" — the backend validates format when a
  // field is present, so a blank would 422 a save that only changed the user's name.
  const body = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== "" && v != null),
  );
  const res = await api.patch<ApiResponse<User>>("/auth/me", body);
  return res.data;
}

/** POST /auth/change-password — change the signed-in user's password. */
export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>(
    "/auth/change-password",
    payload,
  );
  return res.data;
}

/** POST /auth/logout-all — invalidate every session/refresh token for the user. */
export async function logoutAll(): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>("/auth/logout-all");
  return res.data;
}
