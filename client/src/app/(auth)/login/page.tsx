"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GoogleIcon from "@/src/components/google-icon";
import CursorGlow from "@/src/components/cursor-glow";

// ── Zod schema ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const formPanelRef = useRef<HTMLDivElement>(null);

  // Mount animation via CSS class + rAF — avoids setState-in-effect warning.
  // We mutate the DOM directly instead of calling setState.
  useEffect(() => {
    const el = formPanelRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.classList.add("panel-visible");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Mousemove — only updates state in an event callback, not synchronously in the effect body.
  useEffect(() => {
    const handleMouse = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: data.email, password: data.password }),
      // });
      // if (!res.ok) { const body = await res.json(); throw new Error(body.message); }
      // router.push("/dashboard");
      console.log("Login payload →", data);
      await new Promise((r) => setTimeout(r, 1500)); // placeholder
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Invalid email or password.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-text font-serif overflow-hidden flex">
      {/* Ambient cursor glow — desktop only */}
      <CursorGlow mousePos={mousePos} />

      {/* ── LEFT PANEL (decorative, lg+) ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(201,162,39,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,162,39,0.05) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 40% 50%, black 30%, transparent 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 520,
            height: 520,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(201,162,39,0.13) 0%, transparent 65%)",
            borderRadius: "50%",
            filter: "blur(8px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <Link href="/" className="cursor-pointer">
            <span className="text-[22px] text-primary">◈</span>
            <span className="text-[18px] font-bold tracking-[0.08em] font-serif">
              ZENITH<span className="text-primary">DOCS</span>
            </span>
          </Link>
        </div>

        {/* Centre visual */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-full max-w-sm border border-primary/20 rounded-md bg-[rgba(31,41,55,0.5)] backdrop-blur-xl overflow-hidden mb-10">
            <div className="px-4 py-3 border-b border-white/6 flex items-center gap-2 bg-black/20">
              {["#ff5f57", "#ffbd2e", "#28ca41"].map((c) => (
                <div
                  key={c}
                  className="w-2 h-2 rounded-full"
                  style={{ background: c }}
                />
              ))}
              <span className="ml-2 text-[11px] text-white/25 font-mono">
                quarterly_report.pdf
              </span>
            </div>
            <div className="p-5">
              <div className="text-[10px] tracking-widest text-primary mb-3 font-sans">
                AI ANALYSIS
              </div>
              {[
                {
                  label: "⚠ Risk",
                  text: "Liability clause (§7.1)",
                  color: "text-red-400",
                },
                {
                  label: "✓ Action",
                  text: "Review by April 15",
                  color: "text-green-400",
                },
                {
                  label: "◆ Entity",
                  text: "GlobalCorp, Sarah Chen",
                  color: "text-blue-300",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-[11px] font-sans mb-2"
                >
                  <span className={`${item.color} min-w-13 tracking-[0.04em]`}>
                    {item.label}
                  </span>
                  <span className="text-text/50">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-[clamp(28px,3vw,40px)] font-normal tracking-[-0.02em] leading-[1.15] mb-4 font-serif">
            Intelligence from
            <br />
            <span className="text-primary italic">every document.</span>
          </h2>
          <p className="text-[14px] text-text/40 leading-[1.7] font-sans max-w-xs">
            Sign in to access your document workspace, summaries, and AI-powered
            insights.
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 flex gap-8 border-t border-text/8 pt-7">
          {[
            { val: "10×", label: "Faster reading" },
            { val: "99%", label: "Accuracy" },
            { val: "5 sec", label: "Processing" },
          ].map((s) => (
            <div key={s.val}>
              <div className="text-[22px] font-light text-primary font-serif tracking-[-0.02em]">
                {s.val}
              </div>
              <div className="text-[11px] text-text/35 tracking-[0.07em] font-sans mt-0.5">
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-12 relative z-10">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-12 lg:hidden">
          <span className="text-[22px] text-primary">◈</span>
          <span className="text-[18px] font-bold tracking-[0.08em] font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>

        <div ref={formPanelRef} className="panel-enter w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <div className="text-[10px] tracking-[0.2em] text-primary mb-3 font-sans">
              WELCOME BACK
            </div>
            <h1 className="text-[clamp(30px,4vw,42px)] font-normal tracking-[-0.025em] leading-[1.1] font-serif mb-3">
              Sign in to
              <br />
              <span className="text-primary italic">your workspace.</span>
            </h1>
            <p className="text-[14px] text-text/40 font-sans leading-[1.6]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary no-underline border-b border-primary/30 pb-px transition-colors duration-200 hover:border-primary"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[10px] tracking-[0.18em] text-text/45 font-sans"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                {...register("email")}
                className={`w-full px-4 py-3.5 bg-white/3 border rounded-sm text-[14px] font-sans text-text placeholder-text/20 outline-none transition-all duration-200 focus:bg-primary/4 focus:shadow-[0_0_0_3px_rgba(201,162,39,0.08)] ${
                  errors.email
                    ? "border-red-500/40 focus:border-red-500/60"
                    : "border-white/10 focus:border-primary/50"
                }`}
              />
              {errors.email && (
                <span className="text-[11px] text-red-400 font-sans flex items-center gap-1.5">
                  <span aria-hidden="true">⚠</span> {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-[10px] tracking-[0.18em] text-text/45 font-sans"
                >
                  PASSWORD
                </label>
                <a
                  href="#"
                  className="text-[11px] text-primary/70 font-sans no-underline transition-colors duration-200 hover:text-primary"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full px-4 py-3.5 pr-12 bg-white/3 border rounded-sm text-[14px] font-sans text-text placeholder-text/20 outline-none transition-all duration-200 focus:bg-primary/4 focus:shadow-[0_0_0_3px_rgba(201,162,39,0.08)] ${
                    errors.password
                      ? "border-red-500/40 focus:border-red-500/60"
                      : "border-white/10 focus:border-primary/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text/25 hover:text-text/55 transition-colors duration-200 text-[16px]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "◎" : "●"}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-red-400 font-sans flex items-center gap-1.5">
                  <span aria-hidden="true">⚠</span> {errors.password.message}
                </span>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-sm text-[12px] text-red-400 font-sans flex items-center gap-2">
                <span aria-hidden="true">⚠</span> {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-4 bg-primary border-none text-background rounded-sm cursor-pointer text-[12px] font-bold tracking-[0.14em] font-sans transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)] flex items-center justify-center gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  SIGNING IN...
                </>
              ) : (
                "SIGN IN →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-text/25 font-sans tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            className="w-full py-3.5 bg-transparent border border-white/10 text-text/60 rounded-sm cursor-pointer text-[12px] tracking-widest font-sans transition-all duration-200 hover:border-white/25 hover:text-text/90 flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            CONTINUE WITH GOOGLE
          </button>
        </div>
      </div>

      <style>{`
        /* Mount animation */
        .panel-enter {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .panel-enter.panel-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
