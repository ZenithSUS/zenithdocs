import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  const body = await req.json();

  const backendRes = await fetch(`${BACKEND_URL}/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  const res = NextResponse.json(data, { status: backendRes.status });

  // If backend returned a refreshToken, set it as httpOnly cookie here
  // Now the cookie is set by vercel.app — same origin, no blocking
  if (data.data?.refreshToken) {
    res.cookies.set("refreshToken", data.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Don't expose refreshToken to the client
    delete data.data.refreshToken;
  }

  return res;
}
