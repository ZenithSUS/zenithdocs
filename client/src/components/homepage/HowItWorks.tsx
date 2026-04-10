function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload",
      desc: "Drop in any PDF, DOCX, or TXT file",
    },
    {
      num: "02",
      title: "Extract Intelligence",
      desc: "AI reads, structures, and identifies key information",
    },
    {
      num: "03",
      title: "Transform Output",
      desc: "Generate summaries, insights, chat, or learning sets",
    },
    {
      num: "04",
      title: "Use Knowledge",
      desc: "Apply structured insights for decisions and understanding",
    },
  ];

  return (
    <section className="px-5 sm:px-8 md:px-12 py-20 md:py-75 max-w-275 mx-auto">
      <div className="mb-12 md:mb-18 text-center">
        <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
          WORKFLOW
        </div>

        <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif">
          From document chaos
          <br />
          <span className="text-text/35">to structured intelligence.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/6 border border-white/6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="px-6 sm:px-8 py-8 sm:py-10 bg-background relative transition-colors duration-300 hover:bg-primary/4 group"
          >
            <div className="text-[11px] text-primary tracking-[0.15em] mb-4 sm:mb-5 font-sans">
              {step.num}
            </div>

            <div className="text-[20px] sm:text-[22px] font-normal mb-2 sm:mb-3 font-serif">
              {step.title}
            </div>

            <div className="text-[13px] sm:text-[14px] text-text/45 leading-[1.6] font-sans">
              {step.desc}
            </div>

            {i < 3 && (
              <>
                <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 text-primary text-[18px] z-2">
                  →
                </div>
                <div className="lg:hidden absolute bottom-3.25 left-1/2 -translate-x-1/2 text-primary text-[16px] z-2 sm:hidden">
                  ↓
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
