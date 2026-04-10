import { Scale, GraduationCap, Users, CheckCircle2 } from "lucide-react";

function UseCases() {
  const personas = [
    {
      role: "Legal Workflows",
      icon: Scale,
      color: "gold",
      items: [
        "Summarize contracts into key obligations",
        "Extract clauses, risks, and conditions instantly",
        "Chat with legal documents for clarification",
        "Turn long agreements into structured insights",
      ],
    },
    {
      role: "Students & Researchers",
      icon: GraduationCap,
      color: "blue",
      items: [
        "Convert textbooks into structured summaries",
        "Generate learning sets from study materials",
        "Ask questions directly from research papers",
        "Extract exam-ready key concepts",
      ],
    },
    {
      role: "Founders & Teams",
      icon: Users,
      color: "gold",
      items: [
        "Summarize pitch decks and business docs",
        "Extract product insights and decisions",
        "Chat with meeting notes and reports",
        "Turn documentation into actionable knowledge",
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
          Turn documents into
          <br />
          <span className="text-text/35">decisions, not reading time.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {personas.map((p, i) => {
          const Icon = p.icon;
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
              {/* Icon */}
              <div className="mb-4 sm:mb-5">
                <Icon
                  size={28}
                  className={`${
                    isGold ? "text-primary" : "text-blue-400"
                  } opacity-90`}
                />
              </div>

              {/* Title */}
              <h3 className="text-[18px] sm:text-[20px] font-normal mb-5 sm:mb-6 font-serif">
                {p.role}
              </h3>

              {/* Items */}
              <ul className="list-none p-0 m-0">
                {p.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-[13px] sm:text-[14px] text-text/55 py-2 border-b border-white/6 font-sans flex items-start gap-2 sm:gap-2.5"
                  >
                    <CheckCircle2
                      size={12}
                      className={
                        isGold ? "text-primary mt-1" : "text-blue-400 mt-1"
                      }
                    />
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
