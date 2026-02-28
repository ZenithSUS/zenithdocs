function UseCases() {
  const personas = [
    {
      role: "Legal Professionals",
      icon: "⚖",
      color: "gold",
      items: [
        "Review contracts in seconds",
        "Extract key clauses automatically",
        "Flag legal risks instantly",
      ],
    },
    {
      role: "Students & Researchers",
      icon: "◎",
      color: "blue",
      items: [
        "Summarize research papers",
        "Break down complex textbooks",
        "Extract exam-relevant points",
      ],
    },
    {
      role: "Founders & Teams",
      icon: "⬡",
      color: "gold",
      items: [
        "Review pitch decks fast",
        "Summarize meeting transcripts",
        "Parse product documentation",
      ],
    },
  ];

  return (
    <section
      id="use-cases"
      className="px-5 sm:px-8 md:px-12 py-16 md:py-25 max-w-275 mx-auto scroll-mt-20"
    >
      <div className="mb-12 md:mb-18">
        <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
          USE CASES
        </div>
        <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif max-w-140">
          Built for everyone
          <br />
          <span className="text-text/35">who reads for work.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {personas.map((p, i) => {
          const isGold = p.color === "gold";
          return (
            <div
              key={i}
              className={`px-6 sm:px-9 py-8 sm:py-10 rounded transition-all duration-300 cursor-default hover:-translate-y-1 ${
                isGold
                  ? "border border-primary/20 bg-primary/3 hover:shadow-[0_20px_60px_rgba(201,162,39,0.15)]"
                  : "border border-blue-600/20 bg-blue-600/3 hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)]"
              }`}
            >
              <div className="text-[26px] sm:text-[28px] mb-3 sm:mb-4">
                {p.icon}
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-normal mb-5 sm:mb-6 font-serif">
                {p.role}
              </h3>
              <ul className="list-none p-0 m-0">
                {p.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-[13px] sm:text-[14px] text-text/55 py-2 border-b border-white/6 font-sans flex items-center gap-2 sm:gap-2.5"
                  >
                    <span
                      className={`text-[10px] ${isGold ? "text-primary" : "text-blue-400"}`}
                    >
                      ◆
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default UseCases;
