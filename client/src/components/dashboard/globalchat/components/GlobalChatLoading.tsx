import { ThreeDot } from "react-loading-indicators";

function GlobalChatLoading() {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center gap-3
          bg-[#0d0d0f] h-[50vh] w-[30vw] rounded-2xl
          border border-white/6 shadow-2xl"
      style={{
        boxShadow:
          "0 0 60px rgba(201,162,39,0.04), 0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #C9A227, transparent)",
          }}
        />
      </div>
      <ThreeDot size="medium" text="" color="#C9A227" />
      <p className="text-white/30 text-[11px] tracking-[0.15em] uppercase font-mono">
        Loading messages
      </p>
    </div>
  );
}

export default GlobalChatLoading;
