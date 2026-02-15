"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import getPasswordStrength from "@/utils/password-strength";
import GoogleIcon from "@/components/GoogleIcon";
import CursorGlow from "@/components/CursorGlow";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const formPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = formPanelRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.classList.add("panel-visible");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  // useWatch is memoization-safe for React Compiler; watch() is not
  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });
  const confirmValue = useWatch({
    control,
    name: "confirmPassword",
    defaultValue: "",
  });
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: data.email, password: data.password }),
      //   // role defaults to "user", tokensUsed defaults to 0 on the server
      // });
      // if (!res.ok) { const body = await res.json(); throw new Error(body.message); }
      // router.push("/login");
      console.log("Register payload →", {
        email: data.email,
        password: data.password,
      });
      await new Promise((r) => setTimeout(r, 1600)); // placeholder
      setSuccess(true);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-background text-text font-serif flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-[48px] text-primary mb-6">◈</div>
          <div className="text-[10px] tracking-[0.2em] text-primary mb-3 font-sans">
            ACCOUNT CREATED
          </div>
          <h2 className="text-[clamp(26px,4vw,36px)] font-normal tracking-[-0.02em] font-serif mb-4">
            Welcome to
            <br />
            <span className="text-primary italic">ZenithDocs.</span>
          </h2>
          <p className="text-[14px] text-text/40 font-sans leading-[1.7] mb-8">
            Your account is ready. You get 50 free pages per month to start
            extracting intelligence from your documents.
          </p>
          <Link
            href="/login"
            className="inline-block px-9 py-4 bg-primary text-background text-[12px] font-bold tracking-[0.14em] font-sans rounded-sm no-underline transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)]"
          >
            SIGN IN NOW →
          </Link>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-text font-serif overflow-hidden flex">
      {/* Ambient cursor glow */}
      <CursorGlow mousePos={mousePos} />

      {/* ── LEFT PANEL (decorative, lg+) ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-14 overflow-hidden">
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
            width: 480,
            height: 480,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 65%)",
            borderRadius: "50%",
            filter: "blur(8px)",
          }}
        />

        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <div className="relative z-10 flex items-center gap-2.5">
            <span className="text-[22px] text-primary">◈</span>
            <span className="text-[18px] font-bold tracking-[0.08em] font-serif">
              ZENITH<span className="text-primary">DOCS</span>
            </span>
          </div>
        </Link>

        {/* Feature list */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-4">
          <div className="text-[10px] tracking-[0.2em] text-primary mb-5 font-sans">
            FREE PLAN INCLUDES
          </div>
          <div className="flex flex-col gap-3 mb-12">
            {[
              {
                icon: "◈",
                title: "50 pages / month",
                desc: "No credit card required",
              },
              {
                icon: "◉",
                title: "AI summaries",
                desc: "Technical, executive & casual modes",
              },
              {
                icon: "◎",
                title: "Document chat",
                desc: "Ask questions, get direct answers",
              },
              {
                icon: "◆",
                title: "Insight extraction",
                desc: "Risks, actions, entities auto-detected",
              },
              {
                icon: "▣",
                title: "Secure storage",
                desc: "JWT auth & encrypted document handling",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 border border-white/6 rounded-sm bg-white/2 transition-colors duration-200 hover:border-primary/20 hover:bg-primary/3"
              >
                <span className="text-[16px] text-primary mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <div className="text-[14px] font-normal font-serif mb-0.5">
                    {item.title}
                  </div>
                  <div className="text-[12px] text-text/35 font-sans">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-text/30 font-sans leading-[1.6] border-t border-text/8 pt-6">
            Upgrade anytime for unlimited pages, document comparison, and team
            collaboration.
          </p>
        </div>

        <div className="relative z-10 text-[11px] text-text/20 font-sans tracking-[0.06em]">
          © 2024 ZENITHDOCS · AI DOCUMENT INTELLIGENCE
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-12 relative z-10">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <span className="text-[22px] text-primary">◈</span>
          <span className="text-[18px] font-bold tracking-[0.08em] font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>

        <div ref={formPanelRef} className="panel-enter w-full max-w-md">
          {/* Header */}
          <div className="mb-9">
            <div className="text-[10px] tracking-[0.2em] text-primary mb-3 font-sans">
              CREATE ACCOUNT
            </div>
            <h1 className="text-[clamp(28px,4vw,40px)] font-normal tracking-[-0.025em] leading-[1.1] font-serif mb-3">
              Start for free.
              <br />
              <span className="text-primary italic">No card needed.</span>
            </h1>
            <p className="text-[14px] text-text/40 font-sans leading-[1.6]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary no-underline border-b border-primary/30 pb-px transition-colors duration-200 hover:border-primary"
              >
                Sign in
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
              <label
                htmlFor="password"
                className="text-[10px] tracking-[0.18em] text-text/45 font-sans"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
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

              {/* Strength meter */}
              {passwordValue && (
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="flex-1 h-0.5 rounded-full transition-all duration-300"
                        style={{
                          background:
                            n <= strength.score
                              ? strength.color
                              : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[10px] tracking-[0.08em] font-sans min-w-8"
                    style={{ color: strength.color }}
                  >
                    {strength.label.toUpperCase()}
                  </span>
                </div>
              )}

              {errors.password && (
                <span className="text-[11px] text-red-400 font-sans flex items-center gap-1.5">
                  <span aria-hidden="true">⚠</span> {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-[10px] tracking-[0.18em] text-text/45 font-sans"
              >
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  {...register("confirmPassword")}
                  className={`w-full px-4 py-3.5 pr-12 bg-white/3 border rounded-sm text-[14px] font-sans text-text placeholder-text/20 outline-none transition-all duration-200 focus:bg-primary/4 focus:shadow-[0_0_0_3px_rgba(201,162,39,0.08)] ${
                    errors.confirmPassword
                      ? "border-red-500/40 focus:border-red-500/60"
                      : confirmValue && passwordValue === confirmValue
                        ? "border-green-500/30 focus:border-green-500/50"
                        : "border-white/10 focus:border-primary/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text/25 hover:text-text/55 transition-colors duration-200 text-[16px]"
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirm ? "◎" : "●"}
                </button>
                {/* Live match indicator */}
                {confirmValue &&
                  passwordValue === confirmValue &&
                  !errors.confirmPassword && (
                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-green-400 text-[13px]">
                      ✓
                    </span>
                  )}
              </div>
              {errors.confirmPassword && (
                <span className="text-[11px] text-red-400 font-sans flex items-center gap-1.5">
                  <span aria-hidden="true">⚠</span>{" "}
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-sm text-[12px] text-red-400 font-sans flex items-center gap-2">
                <span aria-hidden="true">⚠</span> {serverError}
              </div>
            )}

            {/* Terms */}
            <p className="text-[11px] text-text/25 font-sans leading-[1.6] -mt-1">
              By creating an account you agree to our{" "}
              <a
                href="#"
                className="text-text/45 no-underline hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-text/45 no-underline hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full py-4 bg-primary border-none text-background rounded-sm cursor-pointer text-[12px] font-bold tracking-[0.14em] font-sans transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)] flex items-center justify-center gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                "CREATE FREE ACCOUNT →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
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
            SIGN UP WITH GOOGLE
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
