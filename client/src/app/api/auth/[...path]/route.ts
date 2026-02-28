import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? process.env.BACKEND_URL_DEV!
    : process.env.BACKEND_URL!;

const API_KEY = process.env.API_KEY!;

const COOKIE_ROUTES: Record<string, string> = {
  "auth/login": "set",
  "auth/refresh": "set",
  "auth/logout": "clear",
};

export const runtime = "edge";

async function fetchBackend(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: BodyInit,
) {
  return fetch(url, { method, headers, body });
}

/**
 * Edge API route handler for authentication endpoints.
 *
 * Handles authentication-related requests by delegating to the backend API.
 * If the backend API returns a 401 or 403 response with an x-auth-error header
 * indicating a missing/invalid/expired token, the handler will attempt to auto-refresh
 * the access token if a refresh token cookie is present. If the refresh is successful,
 * the handler will retry the original request with the new access token. If the refresh
 * fails, the handler will clear the refresh token cookie and return a 401 response.
 *
 * The handler will also set or clear the refresh token cookie based on the path of the request.
 */
async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: pathSegments } = await params;
    const path = "auth/" + pathSegments.join("/");

    const authorization = req.headers.get("authorization");
    const refreshTokenCookie = req.cookies.get("refreshToken")?.value;
    const body = req.method !== "GET" ? await req.text() : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...(authorization && { Authorization: authorization }),
    };

    console.log(`[Route Handler] ${req.method} /${path}`);

    let backendRes = await fetchBackend(
      `${BACKEND_URL}/${path}`,
      req.method,
      headers,
      body,
    );

    const authError = backendRes.headers.get("x-auth-error");

    const isTokenError =
      authError === "missing_token" ||
      authError === "token_expired" ||
      authError === "invalid_token";

    // Auto refresh: if 403 and we have a refresh token cookie, try to refresh
    if (
      backendRes.status === 401 &&
      isTokenError &&
      refreshTokenCookie &&
      path !== "auth/refresh"
    ) {
      console.log(`[Route Handler] 403 on /${path} — attempting token refresh`);

      const refreshRes = await fetchBackend(
        `${BACKEND_URL}/auth/refresh`,
        "POST",
        { "Content-Type": "application/json", "x-api-key": API_KEY },
        JSON.stringify({ refreshToken: refreshTokenCookie }),
      );

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const newAccessToken = refreshData.data?.accessToken;

        if (newAccessToken) {
          console.log(`[Route Handler] Token refreshed — retrying /${path}`);

          headers.Authorization = `Bearer ${newAccessToken}`;
          backendRes = await fetchBackend(
            `${BACKEND_URL}/${path}`,
            req.method,
            headers,
            body,
          );

          const data = await backendRes.json();
          const { refreshToken, ...safeData } = data.data ?? {};
          const res = NextResponse.json(
            { ...data, data: safeData },
            { status: backendRes.status },
          );

          res.headers.set("x-access-token", newAccessToken);

          if (refreshToken) {
            res.cookies.set("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
              path: "/",
            });
          }

          console.log(
            `[Route Handler] Retry successful — ${backendRes.status} /${path}`,
          );
          return res;
        }
      }

      console.warn(
        `[Route Handler] Refresh failed — clearing cookie, returning 401`,
      );
      const res = NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 },
      );
      res.cookies.delete("refreshToken");
      return res;
    }

    if (!backendRes.ok) {
      const error = await backendRes.json();
      console.error(
        `[Route Handler] Backend error ${backendRes.status} on /${path}:`,
        error,
      );
      return NextResponse.json(error, { status: backendRes.status });
    }

    const data = await backendRes.json();
    const cookieAction = COOKIE_ROUTES[path];
    const { refreshToken, ...safeData } = data.data ?? {};

    const res = NextResponse.json(
      { ...data, data: safeData },
      { status: backendRes.status },
    );

    if (cookieAction === "set" && refreshToken) {
      console.log(`[Route Handler] Setting refreshToken cookie for /${path}`);
      res.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });
    }

    if (cookieAction === "clear") {
      console.log(`[Route Handler] Clearing refreshToken cookie for /${path}`);
      res.cookies.delete("refreshToken");
    }

    console.log(`[Route Handler] ${backendRes.status} /${path}`);
    return res;
  } catch (error) {
    console.error("[Route Handler] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
