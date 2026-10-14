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

type RefreshOutcome =
  | { ok: true; tokens: AuthTokens }
  // "invalid": the refresh token is genuinely rejected — safe to log out.
  // "unavailable": rate limited / 5xx / network blip on the refresh call
  // itself — NOT a verdict on the session, must not clear it.
  | { ok: false; reason: "invalid" | "unavailable" };

// React cache is scoped to a server render. Never share credentials in a
// process-global promise: concurrent requests can belong to different users.
async function performRefresh(): Promise<RefreshOutcome> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return { ok: false, reason: "invalid" };

  try {
    const tokens = await refreshTokens(refreshToken);
    if (!tokens) return { ok: false, reason: "invalid" };
    try {
      await setSession(tokens);
    } catch {
      // Server Components cannot write cookies; the proxy persists rotation.
    }
    return { ok: true, tokens };
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    const reason = status === 401 || status === 403 ? "invalid" : "unavailable";
    return { ok: false, reason };
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
    const outcome = await performRefresh();

    if (!outcome.ok) {
      if (outcome.reason === "invalid") {
        try {
          await clearSession();
          await clearProfile();
        } catch {
          // ignore — caller layer will redirect
        }
      } else {
        // Rate limited / backend hiccup on the refresh call — the original
        // error's status is still 401, but that's not a confirmed-invalid
        // session; mark it so callers (e.g. getSessionUser) don't treat a
        // transient failure as "logged out".
        (error as AxiosError & { authUnavailable?: boolean }).authUnavailable = true;
      }
      return Promise.reject(error);
    }

    original.headers.set("Authorization", `Bearer ${outcome.tokens.accessToken}`);
    return api(original);
  },
);
