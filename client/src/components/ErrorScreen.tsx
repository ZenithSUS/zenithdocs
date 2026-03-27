"use client";

import { AxiosError } from "@/types/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface ErrorScreenProps {
  error: AxiosError | null;
  onRetry?: () => void;
  messageErrorTitle?: string;
  retries: number;
}

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

function subMessage(statusCode: number) {
  switch (statusCode) {
    case 401:
      return "Unauthorized.";
    case 404:
      return "Data or resource not found.";
    case 400:
      return "Bad request.";
    case 500:
      return "Internal server error.";
    default:
      return "An unexpected error occurred.";
  }
}

function ErrorScreen({
  error,
  onRetry,
  messageErrorTitle,
  retries,
}: ErrorScreenProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(RETRY_INTERVAL_MS / 1000);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statusCode = error?.response?.status ?? 500;
  const isServerSleeping =
    !error?.response &&
    (error?.code === "ECONNABORTED" ||
      error?.message?.includes("Network Error"));
  const hasExceededRetries = retries >= MAX_RETRIES;

  let message =
    error?.response?.data?.message ?? "An unexpected error occurred.";
  let title = subMessage(statusCode);

  if (isServerSleeping) {
    if (hasExceededRetries) {
      title = "Server is taking too long";
      message = "Please try again manually.";
    } else {
      title = "Waking up server...";
      message = "This may take a few seconds. Please wait or retry.";
    }
  }

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Stop entirely once max retries reached
    if (!isServerSleeping || !onRetry || hasExceededRetries) {
      clearTimers();
      return;
    }

    const seconds = RETRY_INTERVAL_MS / 1000;
    setCountdown(seconds);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      onRetry();
    }, RETRY_INTERVAL_MS);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retries]);

  const handleManualRetry = () => {
    clearTimers();
    setCountdown(RETRY_INTERVAL_MS / 1000);
    onRetry?.();
  };

  const retryLabel = (() => {
    if (!isServerSleeping || hasExceededRetries) return "Try again";
    return countdown > 0
      ? `Retrying in ${countdown}s (${retries + 1}/${MAX_RETRIES})`
      : "Retrying…";
  })();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#111111] font-serif text-[#f5f5f5] flex items-center justify-center">
      {/* Radial gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(201,162,39,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Decorative rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a227]/[0.07]"
        style={{ top: "50%", left: "50%", width: 500, height: 500 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a227]/4"
        style={{ top: "50%", left: "50%", width: 700, height: 700 }}
      />

      {/* Card */}
      <div className="error-card relative z-10 mx-4 flex w-full max-w-md flex-col items-center gap-7 rounded-xs border border-[#c9a227]/18 bg-[#1a1a1a]/80 px-10 py-12 shadow-[0_0_0_1px_rgba(201,162,39,0.06),0_32px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        {/* Icon */}
        <div className="error-icon" aria-hidden>
          <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="27"
              cy="27"
              r="25"
              stroke="rgba(201,162,39,0.35)"
              strokeWidth="1"
            />
            <circle
              cx="27"
              cy="27"
              r="19"
              stroke="rgba(201,162,39,0.15)"
              strokeWidth="1"
            />
            <line
              x1="27"
              y1="15"
              x2="27"
              y2="30"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="27" cy="37" r="1.75" fill="#ef4444" />
          </svg>
        </div>

        {/* Text block */}
        <div className="space-y-2 text-center">
          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-[#ef4444]/80">
            {messageErrorTitle ??
              (isServerSleeping ? "SERVER SLEEPING" : "ERROR")}
          </p>
          <h1 className="text-[1.45rem] font-normal leading-snug text-[#f5f5f5]">
            {title}
          </h1>
          <p className="text-[0.8rem] text-[#a3a3a3]">{message}</p>
        </div>

        {/* Gold divider */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-[#c9a227]/25 to-transparent" />

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          {onRetry && statusCode !== 404 && (
            <button
              onClick={handleManualRetry}
              className="flex-1 cursor-pointer rounded-xs border border-[#c9a227] bg-[#c9a227] px-5 py-2.5 text-sm tracking-[0.07em] text-[#111111] transition-opacity duration-200 hover:opacity-85"
            >
              {retryLabel}
            </button>
          )}
          {statusCode === 404 && (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 cursor-pointer rounded-xs border border-[#c9a227] bg-[#c9a227] px-5 py-2.5 text-sm tracking-[0.07em] text-[#111111] transition-opacity duration-200 hover:opacity-85"
            >
              Go back
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="flex-1 cursor-pointer rounded-xs border border-[#c9a227]/18 bg-transparent px-5 py-2.5 text-sm tracking-[0.07em] text-[#a3a3a3] transition-colors duration-200 hover:border-[#c9a227]/40 hover:text-[#f5f5f5]"
          >
            Go home
          </button>
        </div>
      </div>

      <style>{`
        @keyframes errorFadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes iconPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        .error-card {
          animation: errorFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .error-icon svg {
          animation: iconPulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ErrorScreen;
