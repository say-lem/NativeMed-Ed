import "server-only";
import { cache } from "react";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearSession,
  clearProfile,
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

// React cache is scoped to a server render. Never share credentials in a
// process-global promise: concurrent requests can belong to different users.
async function performRefresh(): Promise<AuthTokens | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;
    const tokens = await refreshTokens(refreshToken);
    if (!tokens) return null;
    try {
      await setSession(tokens);
    } catch {
      // Server Components cannot write cookies; the proxy persists rotation.
    }
    return tokens;
  } catch {
    return null;
  }
}

const refreshTokens = cache(async (refreshToken: string): Promise<AuthTokens | null> => {
  const res = await axios.post<ApiResponse<AuthTokens>>(
    `${baseURL}/auth/refresh-token`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" }, timeout: 15_000, maxRedirects: 0 },
  );
  return res.data.success ? res.data.data : null;
});

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _netRetry?: number;
};

// A missing response does not prove a mutation failed. Only retry reads.
const MAX_NETWORK_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;
const RETRIABLE_CODES = new Set([
  "ECONNRESET",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "EAI_AGAIN",
]);

function isTransientNetworkError(error: AxiosError): boolean {
  if (error.response) return false; // got an HTTP status → not a transport failure
  return error.code ? RETRIABLE_CODES.has(error.code) : true;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // Transient network blip (e.g. cold start) → retry with backoff.
    if (original && ["get", "head", "options"].includes(original.method?.toLowerCase() ?? "get") && isTransientNetworkError(error)) {
      const attempt = original._netRetry ?? 0;
      if (attempt < MAX_NETWORK_RETRIES) {
        original._netRetry = attempt + 1;
        const delay = RETRY_BASE_DELAY_MS * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(original);
      }
    }

    if (!original || status !== 401 || isAuthEndpoint(original.url) || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    const tokens = await performRefresh();

    if (!tokens) {
      try {
        await clearSession();
        await clearProfile();
      } catch {
        // ignore — caller layer will redirect
      }
      return Promise.reject(error);
    }

    original.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    return api(original);
  },
);
