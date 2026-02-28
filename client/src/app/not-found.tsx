"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  LogIn,
  LayoutDashboard,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import CursorGlow from "@/components/CursorGlow";

export default function NotFoundPage() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Countdown timer — only decrements, does NOT navigate
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Navigate when countdown hits 0
  useEffect(() => {
    if (countdown === 0 && selectedRoute) {
      router.push(selectedRoute);
    }
  }, [countdown, selectedRoute, router]);

  const handleRedirect = (route: string) => {
    setSelectedRoute(route);
    setCountdown(3);
  };

  const cancelRedirect = () => {
    setSelectedRoute(null);
    setCountdown(null);
  };

  const routes = [
    {
      path: "/",
      icon: Home,
      label: "Home",
      description: "Return to the homepage",
      gradient: "from-primary/20 to-transparent",
    },
    {
      path: "/login",
      icon: LogIn,
      label: "Login",
      description: "Sign in to your account",
      gradient: "from-blue-500/20 to-transparent",
    },
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Go to your dashboard",
      gradient: "from-primary/20 to-transparent",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif overflow-x-hidden flex items-center justify-center relative py-16 px-5 sm:px-8 md:px-12">
      <CursorGlow mousePos={mousePos} />

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full blur-[60px] opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Decorative elements — hidden on small screens, pointer-events-none */}
      <div className="absolute bottom-10 left-10 text-[#C9A227]/10 text-[200px] font-serif leading-none pointer-events-none hidden lg:block select-none">
        ◈
      </div>
      <div className="absolute top-10 right-10 text-[#C9A227]/10 text-[200px] font-serif leading-none pointer-events-none hidden lg:block select-none">
        ◈
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-[clamp(80px,15vw,180px)] font-normal leading-none tracking-[-0.04em] text-[#C9A227] mb-4 font-serif opacity-90">
            404
          </h1>
          <div className="h-px w-32 bg-linear-to-r from-transparent via-[#C9A227]/50 to-transparent mx-auto mb-6" />
        </div>

        {/* Message */}
        <h2 className="text-[clamp(24px,4vw,40px)] font-normal mb-4 tracking-[-0.02em] font-serif">
          Page Not Found
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#F5F5F5]/50 font-sans mb-10 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Choose
          where you'd like to go:
        </p>

        {/* Countdown banner */}
        {countdown !== null && selectedRoute && (
          <div className="mb-8 p-4 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[13px] text-[#F5F5F5]/70 font-sans mb-2">
              Redirecting in{" "}
              <span className="text-[#C9A227] font-bold text-[16px]">
                {countdown}
              </span>{" "}
              second{countdown !== 1 ? "s" : ""}...
            </p>
            <button
              onClick={cancelRedirect}
              className="text-[11px] text-[#F5F5F5]/40 hover:text-[#F5F5F5]/70 font-sans tracking-wider transition-colors"
            >
              CANCEL
            </button>
          </div>
        )}

        {/* Route cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {routes.map((route) => {
            const isSelected = selectedRoute === route.path;
            const Icon = route.icon;
            return (
              <button
                key={route.path}
                onClick={() => handleRedirect(route.path)}
                disabled={countdown !== null}
                className={`group relative p-6 rounded-lg border transition-all duration-300 text-left overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-[#C9A227] bg-[#C9A227]/10 scale-105"
                    : "border-white/10 bg-white/5 hover:border-[#C9A227]/50 hover:bg-white/8 hover:scale-105"
                }`}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${route.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative">
                  {/* Icon */}
                  <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      size={32}
                      className="text-[#C9A227]/80 group-hover:text-[#C9A227] transition-colors"
                    />
                  </div>

                  {/* Label */}
                  <h3 className="text-[16px] font-normal mb-2 font-serif text-[#F5F5F5]/90 group-hover:text-[#F5F5F5] transition-colors">
                    {route.label}
                  </h3>

                  {/* Description */}
                  <p className="text-[12px] text-[#F5F5F5]/40 font-sans leading-relaxed">
                    {route.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-[#C9A227]/0 group-hover:text-[#C9A227] transition-colors">
                    <span className="tracking-wider font-sans">GO</span>
                    <ArrowRight
                      size={12}
                      className="transform translate-x-0 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Help text */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb size={20} className="text-[#C9A227] shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-[12px] text-[#F5F5F5]/60 font-sans leading-[1.7]">
                <strong className="text-[#F5F5F5]/80">Need help?</strong> If you
                believe this is an error, please check the URL or contact
                support. You can also use your browser's back button to return
                to the previous page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
