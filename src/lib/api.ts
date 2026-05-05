import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setSession,
} from "./session";
import type { ApiResponse, AuthTokens } from "@/types/api";

const baseURL = `${process.env.API_URL ?? "http://localhost:5000"}/api/v1`;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  if (config.headers.has("Authorization")) return config;
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

const AUTH_ENDPOINT_PATTERNS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINT_PATTERNS.some((p) => url.includes(p));
}

let refreshInFlight: Promise<AuthTokens | null> | null = null;

async function performRefresh(): Promise<AuthTokens | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      const res = await axios.post<ApiResponse<AuthTokens>>(
        `${baseURL}/auth/refresh-token`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      if (!res.data.success) return null;

      const tokens = res.data.data;
      try {
        await setSession(tokens);
      } catch {
        // Server Component context cannot set cookies.
        // Tokens are still returned so the in-flight request can retry once.
      }
      return tokens;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (!original || status !== 401 || isAuthEndpoint(original.url) || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    const tokens = await performRefresh();

    if (!tokens) {
      try {
        await clearSession();
      } catch {
        // ignore — caller layer will redirect
      }
      return Promise.reject(error);
    }

    original.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    return api(original);
  },
);
