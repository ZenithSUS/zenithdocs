import { useEffect, useState } from "react";

function DashboardLoading() {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  // Simulated progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 95);
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text font-serif flex items-center justify-center overflow-hidden relative">
      {/* Ambient grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)",
        }}
      />

      {/* Central glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,39,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Logo + spinner */}
        <div className="relative">
          {/* Spinning ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "#C9A227",
                borderRightColor: "rgba(201,162,39,0.3)",
              }}
            />
          </div>

          {/* Logo icon */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <span className="text-[36px] text-primary animate-pulse-slow">
              ◈
            </span>
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <div className="text-[22px] font-bold tracking-[0.08em] font-serif mb-1">
            ZENITH<span className="text-primary">DOCS</span>
          </div>
          <div className="text-[11px] tracking-[0.15em] text-text/30 font-sans">
            AI DOCUMENT INTELLIGENCE
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 sm:w-80">
          <div className="w-full h-1 bg-white/6 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-linear-to-r from-primary to-[#e0b530] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-sans">
            <span className="text-text/40 tracking-[0.08em]">
              LOADING{dots}
            </span>
            <span className="text-primary font-bold">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading messages */}
        <div className="text-[12px] text-text/25 font-sans text-center h-5">
          {progress < 30 && "Initializing workspace..."}
          {progress >= 30 && progress < 60 && "Loading documents..."}
          {progress >= 60 && progress < 85 && "Preparing summaries..."}
          {progress >= 85 && "Almost ready..."}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-spin {
          animation: spin 1.2s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default DashboardLoading;
