import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function safeRedirect(req: NextRequest, target: string) {
  const currentPath = req.nextUrl.pathname;

  if (currentPath === target) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(target, req.url));
}

export default function proxy(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Handle root route
  if (pathname === "/") {
    return token
      ? safeRedirect(req, "/dashboard")
      : safeRedirect(req, "/login");
  }

  // If not logged in and trying to access protected route
  if (!token && isProtectedRoute) {
    return safeRedirect(req, "/login");
  }

  // If logged in and trying to access auth pages
  if (token && isAuthRoute) {
    return safeRedirect(req, "/dashboard");
  }

  const response = NextResponse.next();

  // Set headers
  response.headers.set("x-pathname", pathname);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
