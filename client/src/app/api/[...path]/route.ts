import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;
const API_KEY = process.env.API_KEY!;

const COOKIE_ROUTES: Record<string, string> = {
  "auth/login": "set",
  "auth/refresh": "set",
  "auth/logout": "clear",
};

async function handler(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const { path: pathSegments } = await params; // await params
  const path = pathSegments.join("/");
  console.log("Path:", path);

  const backendRes = await fetch(`${BACKEND_URL}/api/${path}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: req.method !== "GET" ? await req.text() : undefined,
  });

  if (!backendRes.ok) {
    const error = await backendRes.json();
    console.error("Backend error:", error);
    return NextResponse.json(error, { status: backendRes.status });
  }

  const data = await backendRes.json();
  const cookieAction = COOKIE_ROUTES[path];

  // Strip refreshToken from the request body
  const { refreshToken, ...safeData } = data.data ?? {};

  const res = NextResponse.json(
    { ...data, data: safeData },
    { status: backendRes.status },
  );

  if (cookieAction === "set" && refreshToken) {
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  if (cookieAction === "clear") {
    res.cookies.delete("refreshToken");
  }

  return res;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
