"use client";

import { memo } from "react";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

interface FormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (data: FormInputs) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<FormInputs, FormInputs>;
  errors: FieldErrors<FormInputs>;
  register: UseFormRegister<FormInputs>;
  passwordValue: string;
  confirmValue: string;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirm: boolean;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  strength: {
    score: number;
    label: string;
    color: string;
  };
  serverError: string;
  isSubmitting: boolean;
  isPending: boolean;
}

function RegisterForm({
  onSubmit,
  handleSubmit,
  errors,
  register,
  passwordValue,
  confirmValue,
  showPassword,
  setShowPassword,
  showConfirm,
  setShowConfirm,
  strength,
  serverError,
  isSubmitting,
  isPending,
}: RegisterFormProps) {
  return (
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
              showConfirm ? "Hide confirm password" : "Show confirm password"
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
            <span aria-hidden="true">⚠</span> {errors.confirmPassword.message}
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
        disabled={isSubmitting || isPending}
        className="mt-1 w-full py-4 bg-primary border-none text-background rounded-sm cursor-pointer text-[12px] font-bold tracking-[0.14em] font-sans transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)] flex items-center justify-center gap-2.5"
      >
        {isSubmitting || isPending ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            CREATING ACCOUNT...
          </>
        ) : (
          "CREATE FREE ACCOUNT →"
        )}
      </button>
    </form>
  );
}

export default memo(RegisterForm);
