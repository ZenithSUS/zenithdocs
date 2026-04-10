"use client";

import Link from "next/link";
import GoogleIcon from "@/components/GoogleIcon";
import CursorGlow from "@/components/CursorGlow";
import useRegisterPage from "./useRegisterPage";
import RegisterForm from "./components/RegisterForm";
import FeatureList from "./components/FeatureList";
import RegisterFormHeader from "./components/RegisterFormHeader";

export default function RegisterPage() {
  const {
    // UI
    mousePos,

    // Refs
    formPanelRef,

    // Form
    register,
    errors,

    // Handlers
    handleSubmit,
    handleOAuthRegister,
    onSubmit,

    // Values
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    serverError,
    isSubmitting,
    strength,
    passwordValue,
    confirmValue,
    isPending,
  } = useRegisterPage();

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
        <FeatureList />

        <div className="relative z-10 text-[11px] text-text/20 font-sans tracking-[0.06em]">
          © {new Date().getFullYear()} ZENITHDOCS · AI DOCUMENT INTELLIGENCE
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-12 relative z-10">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <Link href="/" className="cursor-pointer">
            <span className="text-[22px] text-primary">◈</span>
            <span className="text-[18px] font-bold tracking-[0.08em] font-serif">
              ZENITH<span className="text-primary">DOCS</span>
            </span>
          </Link>
        </div>

        <div ref={formPanelRef} className="panel-enter w-full max-w-md">
          {/* Header */}
          <RegisterFormHeader />

          {/* Form */}
          <RegisterForm
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
            passwordValue={passwordValue}
            confirmValue={confirmValue}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            strength={strength}
            serverError={serverError}
            isSubmitting={isSubmitting}
            isPending={isPending}
          />

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
            onClick={handleOAuthRegister}
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
