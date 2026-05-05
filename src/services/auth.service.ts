import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  AuthSuccessData,
  AuthTokens,
  User,
} from "@/types/api";
import type { LoginValues, RegisterValues } from "@/lib/schemas/auth";

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
