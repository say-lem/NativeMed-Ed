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

async function tryRefresh(refreshToken: string): Promise<RefreshSuccess | null> {
  try {
    const res = await fetch(`${baseURL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as
      | { success: true; data: RefreshSuccess }
      | { success: false };
    if (!json.success) return null;
    return json.data;
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  const response = NextResponse.redirect(url);
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    const payload = decodeJwt(accessToken);
    if (!isExpired(payload, 30)) {
      return NextResponse.next();
    }
  }

  if (!refreshToken) {
    return redirectToLogin(request);
  }

  const refreshed = await tryRefresh(refreshToken);
  if (!refreshed) {
    return redirectToLogin(request);
  }

  request.cookies.set(ACCESS_TOKEN_COOKIE, refreshed.accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE, refreshed.refreshToken);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.cookies.set(ACCESS_TOKEN_COOKIE, refreshed.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshed.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  return response;
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/courses",
    "/courses/:path*",
    "/mock",
    "/mock/:path*",
    "/subscriptions",
    "/subscriptions/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
