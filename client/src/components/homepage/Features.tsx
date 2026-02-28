function Features() {
  const features = [
    {
      icon: "◈",
      title: "Detailed Summary",
      desc: "Get a thorough, structured breakdown of your document — every section, argument, and key point explained in full.",
      tag: "In-Depth",
    },
    {
      icon: "◉",
      title: "Bullet Summary",
      desc: "Scan the essentials at a glance. Key ideas distilled into clean, scannable bullet points for rapid review.",
      tag: "Scannable",
    },
    {
      icon: "◎",
      title: "Short Summary",
      desc: "One paragraph. The whole picture. Perfect when you need just enough context to make a decision fast.",
      tag: "Quick Read",
    },
    {
      icon: "⬡",
      title: "Executive Summary",
      desc: "Board-ready. Polished language, strategic framing, and only the information that matters at the top level.",
      tag: "Professional",
    },
  ];

  return (
    <section
      id="features"
      className="px-5 sm:px-8 md:px-12 py-16 md:py-25 max-w-275 mx-auto scroll-mt-20"
    >
      <div className="mb-12 md:mb-18 text-center">
        <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
          SUMMARY MODES
        </div>
        <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif">
          Four ways to understand
          <br />
          <span className="text-text/35">any document.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/6">
        {features.map((feat, i) => (
          <div
            key={i}
            className="px-6 sm:px-9 py-8 sm:py-10 bg-background transition-all duration-300 cursor-default relative overflow-hidden hover:bg-[rgba(31,41,55,0.6)]"
          >
            <div className="flex justify-between items-start mb-5 sm:mb-7">
              <span className="text-[22px] sm:text-[24px] text-primary">
                {feat.icon}
              </span>
              <span className="text-[10px] tracking-[0.12em] text-text/30 border border-text/10 px-2 py-0.75 rounded-sm font-sans">
                {feat.tag}
              </span>
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-normal mb-2 sm:mb-3 font-serif">
              {feat.title}
            </h3>
            <p className="text-[13px] sm:text-[14px] text-text/45 leading-[1.7] font-sans">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
