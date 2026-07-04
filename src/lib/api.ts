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

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _netRetry?: number;
};

// Transient transport failures (e.g. Render free-tier cold start) reset the
// socket with NO http response — the request never reached the server, so
// retrying is safe for any method (login included).
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
    if (original && isTransientNetworkError(error)) {
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
      } catch {
        // ignore — caller layer will redirect
      }
      return Promise.reject(error);
    }

    original.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    return api(original);
  },
);
