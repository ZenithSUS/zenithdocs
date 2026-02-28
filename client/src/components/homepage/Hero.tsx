interface Props {
  heroRef: React.RefObject<HTMLDivElement | null>;
  handleRegister: () => void;
  scrollTo: (id: string) => void;
}

function Hero({ heroRef, handleRegister, scrollTo }: Props) {
  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-16 md:pb-20 relative text-center"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 md:w-125 h-64 sm:h-96 md:h-125 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-1 w-full">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 border border-primary/30 rounded-full text-[10px] sm:text-[11px] tracking-[0.15em] text-primary mb-8 md:mb-10 font-sans bg-primary/6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="hidden sm:inline">
            AI DOCUMENT SUMMARIZATION PLATFORM
          </span>
          <span className="sm:hidden">AI DOCUMENT SUMMARIZER</span>
        </div>

        <h1 className="text-[clamp(40px,8vw,96px)] font-normal leading-[1.05] tracking-[-0.03em] mb-5 md:mb-6 font-serif">
          Your AI Brain
          <br />
          <span className="text-primary italic">for Documents.</span>
        </h1>

        <p className="text-[15px] sm:text-[16px] md:text-[18px] text-text/55 max-w-xs sm:max-w-sm md:max-w-130 mx-auto mb-10 md:mb-12 leading-[1.7] font-sans font-light tracking-[0.01em]">
          Stop wasting hours reading. ZenithDocs transforms any document into
          smart summaries — detailed, bullet, short, or executive — instantly.
        </p>

        <div className="flex gap-3 sm:gap-4 justify-center items-center flex-wrap">
          <button
            onClick={handleRegister}
            className="px-7 sm:px-9 py-3.5 sm:py-4 bg-primary border-none text-background rounded-sm cursor-pointer text-[12px] sm:text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)]"
          >
            START FOR FREE →
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="px-7 sm:px-9 py-3.5 sm:py-4 bg-transparent border border-text/15 text-text rounded-sm cursor-pointer text-[12px] sm:text-[13px] tracking-[0.12em] font-sans transition-all duration-200 hover:border-text/40"
          >
            SEE FEATURES ↓
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row gap-0 justify-center mt-16 md:mt-20 border-t border-text/8 pt-8 md:pt-10">
          {[
            { val: "10×", label: "Faster than manual reading" },
            { val: "99%", label: "Accuracy on structured docs" },
            { val: "5 sec", label: "Average processing time" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`px-8 sm:px-10 md:px-12 py-4 sm:py-0 text-center ${i < 2 ? "sm:border-r border-b sm:border-b-0 border-text/8" : ""}`}
            >
              <div className="text-[28px] sm:text-[32px] md:text-[36px] font-light text-primary tracking-[-0.02em] font-serif">
                {stat.val}
              </div>
              <div className="text-[11px] md:text-[12px] text-text/40 tracking-[0.08em] font-sans mt-1">
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
