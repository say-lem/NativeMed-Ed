import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt, isExpired } from "@/lib/jwt";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const ACCESS_TOKEN_MAX_AGE = 60 * 15;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

const baseURL = `${process.env.API_URL ?? "http://localhost:5000"}/api/v1`;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

interface RefreshSuccess {
  accessToken: string;
  refreshToken: string;
}

type RefreshResult =
  | { ok: true; data: RefreshSuccess }
  // "invalid": the refresh token is genuinely rejected — log out.
  // "unavailable": rate limited / backend hiccup — NOT a verdict on the
  // session, so the caller must not treat it like an invalid token.
  | { ok: false; reason: "invalid" | "unavailable" };

async function tryRefresh(refreshToken: string): Promise<RefreshResult> {
  try {
    const res = await fetch(`${baseURL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      const reason = res.status === 401 || res.status === 403 ? "invalid" : "unavailable";
      return { ok: false, reason };
    }
    const json = (await res.json()) as
      | { success: true; data: RefreshSuccess }
      | { success: false };
    if (!json.success) return { ok: false, reason: "invalid" };
    return { ok: true, data: json.data };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  // Remember where the user was headed so login can send them back.
  const target = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  if (target && target !== "/") {
    url.searchParams.set("redirect", target);
  }
  const response = NextResponse.redirect(url);
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

// Next.js 16 proxy (formerly "middleware"). Runs on every matched route.
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // Access token still valid (30s leeway) → let the request through untouched.
  if (accessToken && !isExpired(decodeJwt(accessToken), 30)) {
    return NextResponse.next();
  }

  // Access token missing/expired. Without a refresh token we can't recover.
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  // Refresh proactively here — the proxy CAN write cookies, so the rotated
  // refresh token is persisted (Server Components cannot, which is the bug
  // this fixes). The backend rotates + invalidates the old refresh token.
  const refreshed = await tryRefresh(refreshToken);
  if (!refreshed.ok) {
    if (refreshed.reason === "invalid") {
      return redirectToLogin(request);
    }
    // Rate limited / backend hiccup — don't wipe a possibly-valid session
    // over it. Let the request through with the existing tokens; the
    // in-render API client has its own refresh-on-401 fallback and will
    // retry once the limiter window clears.
    return NextResponse.next();
  }

  // Forward the new access token to the downstream render in this same request.
  request.cookies.set(ACCESS_TOKEN_COOKIE, refreshed.data.accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE, refreshed.data.refreshToken);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.cookies.set(ACCESS_TOKEN_COOKIE, refreshed.data.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshed.data.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  return response;
}

export const config = {
  matcher: [
    // Member (marketplace) area
    "/dashboard",
    "/dashboard/:path*",
    "/courses",
    "/courses/:path*",
    "/my-courses",
    "/my-courses/:path*",
    "/live-courses",
    "/live-courses/:path*",
    "/my-live-courses",
    "/my-live-courses/:path*",
    "/full-cases",
    "/full-cases/:path*",
    "/subscriptions",
    "/subscriptions/:path*",
    "/settings",
    "/settings/:path*",
    "/payment",
    "/payment/:path*",
    "/one-on-one",
    "/one-on-one/:path*",
    // Admin area
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/admin-subscribers",
    "/admin-subscribers/:path*",
    "/admin-casebank",
    "/admin-casebank/:path*",
    "/admin-courses",
    "/admin-courses/:path*",
    "/admin-live-courses",
    "/admin-live-courses/:path*",
    "/admin-settings",
    "/admin-settings/:path*",
    "/admin-users",
    "/admin-users/:path*",
    "/admin-enrollments",
    "/admin-enrollments/:path*",
    "/admin-reviews",
    "/admin-reviews/:path*",
    "/admin-events",
    "/admin-events/:path*",
    "/admin-homepage",
    "/admin-homepage/:path*",
    "/admin-booking",
    "/admin-booking/:path*",
  ],
};
