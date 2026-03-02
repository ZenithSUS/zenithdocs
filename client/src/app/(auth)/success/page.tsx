"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import Cookies from "js-cookie";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [authStatus, setAuthStatus] = useState<
    "processing" | "success" | "error"
  >("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Animated progress bar
  useEffect(() => {
    if (authStatus !== "processing") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [authStatus]);

  const handleTokenStorage = useCallback(async () => {
    try {
      // Get tokens from URL params
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      // Validate tokens exist
      if (!accessToken || !refreshToken) {
        throw new Error(
          "Missing authentication tokens. Please try logging in again.",
        );
      }

      // Simulate processing time for better UX (minimum 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("accessToken", accessToken);

      // Store refresh token in httpOnly-like cookie (secure)
      Cookies.set("refreshToken", refreshToken, {
        expires: 30, // 30 days
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // CSRF protection
        path: "/",
      });

      setProgress(100);
      setAuthStatus("success");

      // Redirect to dashboard after success animation
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Authentication error:", error);
      setAuthStatus("error");
      setErrorMessage(
        err.message || "Failed to complete authentication. Please try again.",
      );

      // Redirect to login after error display
      setTimeout(() => {
        router.replace("/login?error=auth_failed");
      }, 3000);
    }
  }, [searchParams, router]);

  // Handle authentication on mount
  useEffect(() => {
    handleTokenStorage();
  }, [handleTokenStorage]);

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif overflow-hidden flex items-center justify-center relative">
      <CursorGlow mousePos={mousePos} />

      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Dynamic glow orb based on status */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full blur-[80px] transition-all duration-1000 ${
          authStatus === "processing"
            ? "opacity-40"
            : authStatus === "success"
              ? "opacity-60"
              : "opacity-30"
        }`}
        style={{
          background:
            authStatus === "error"
              ? "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(201,162,39,0.25) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-5 sm:px-8 md:px-12 max-w-lg mx-auto">
        {/* Processing State */}
        {authStatus === "processing" && (
          <div className="animate-in fade-in duration-500">
            {/* Google Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                {/* Rotating ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-[#C9A227] rounded-full animate-spin" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[clamp(28px,5vw,40px)] font-normal mb-4 tracking-[-0.02em] font-serif text-text/90">
              Authenticating...
            </h1>

            {/* Description */}
            <p className="text-[14px] text-text/50 font-sans mb-8 leading-relaxed">
              Securely signing you in with Google
            </p>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#C9A227] to-[#e0b530] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-text/30 font-sans mt-3 tracking-wider">
                {progress}% COMPLETE
              </p>
            </div>

            {/* Loading steps */}
            <div className="space-y-3">
              {[
                { label: "Verifying credentials", delay: 0 },
                { label: "Securing tokens", delay: 200 },
                { label: "Setting up session", delay: 400 },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-3 text-[12px] text-text/40 font-sans animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${step.delay}ms` }}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      progress > idx * 30
                        ? "bg-[#C9A227] animate-pulse"
                        : "bg-white/20"
                    }`}
                  />
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success State */}
        {authStatus === "success" && (
          <div className="animate-in fade-in zoom-in duration-500">
            {/* Success checkmark */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[clamp(28px,5vw,40px)] font-normal mb-4 tracking-[-0.02em] font-serif text-text/90">
              Authentication Successful
            </h1>

            {/* Description */}
            <p className="text-[14px] text-text/50 font-sans mb-6 leading-relaxed">
              Redirecting you to your dashboard...
            </p>

            {/* Success indicator */}
            <div className="flex items-center justify-center gap-2 text-[12px] text-green-500/70 font-sans">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>SECURED</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {authStatus === "error" && (
          <div className="animate-in fade-in zoom-in duration-500">
            {/* Error icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[clamp(28px,5vw,40px)] font-normal mb-4 tracking-[-0.02em] font-serif text-text/90">
              Authentication Failed
            </h1>

            {/* Error message */}
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-[13px] text-red-400/80 font-sans leading-[1.7]">
                {errorMessage}
              </p>
            </div>

            {/* Description */}
            <p className="text-[12px] text-text/40 font-sans leading-relaxed">
              Redirecting back to login...
            </p>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 text-[#C9A227]/5 text-[150px] font-serif leading-none pointer-events-none hidden lg:block">
        G
      </div>
      <div className="absolute top-10 right-10 text-[#C9A227]/5 text-[150px] font-serif leading-none pointer-events-none hidden lg:block">
        ✓
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-in-from-bottom-2 {
          from { transform: translateY(0.5rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
          animation-duration: 0.5s;
        }
        .zoom-in {
          animation-name: zoom-in;
          animation-duration: 0.5s;
        }
        .slide-in-from-bottom-2 {
          animation-name: slide-in-from-bottom-2;
          animation-duration: 0.4s;
        }
      `}</style>
    </div>
  );
}
