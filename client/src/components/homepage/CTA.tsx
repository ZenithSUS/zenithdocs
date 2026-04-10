import { PLAN_LIMITS } from "@/constants/plans";
import { useRouter } from "next/navigation";

function CTA() {
  const router = useRouter();
  const handleLogin = () => router.push("/login");

  return (
    <section className="px-5 sm:px-8 md:px-12 py-20 md:py-30 text-center relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,162,39,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)",
        }}
      />

      <div className="relative z-1">
        {/* Label */}
        <div className="text-[11px] tracking-[0.2em] text-primary mb-5 sm:mb-6 font-sans">
          GET STARTED TODAY
        </div>

        {/* Headline */}
        <h2 className="text-[clamp(34px,7vw,80px)] font-normal tracking-[-0.03em] mb-5 sm:mb-6 font-serif leading-[1.1]">
          Stop reading.
          <br />
          <span className="italic text-primary">Start understanding.</span>
        </h2>

        {/* Description */}
        <p className="text-[14px] sm:text-[15px] md:text-[16px] text-text/45 max-w-xs sm:max-w-sm md:max-w-110 mx-auto mb-10 md:mb-12 leading-[1.7] font-sans">
          Join professionals and teams using ZenithDocs to transform documents
          into summaries, insights, and structured knowledge — instantly.
        </p>

        {/* CTA Button */}
        <div className="flex gap-4 justify-center items-center">
          <button
            type="button"
            className="px-8 sm:px-11 py-4 sm:py-4.5 bg-primary text-background rounded-sm cursor-pointer text-[12px] sm:text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 hover:-translate-y-0.75 hover:shadow-[0_16px_50px_rgba(201,162,39,0.4)]"
            onClick={handleLogin}
          >
            START FREE →
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-4 sm:mt-5 text-[11px] sm:text-[12px] text-text/25 font-sans tracking-[0.05em]">
          No credit card required · {PLAN_LIMITS.free.messagesPerDay} AI
          messages per day · {PLAN_LIMITS.free.documentLimit} documents ·{" "}
          {PLAN_LIMITS.free.storageLimitMB}MB storage
        </p>
      </div>
    </section>
  );
}

export default CTA;
