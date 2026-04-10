import {
  FileText,
  List,
  FileSearch,
  Briefcase,
  MessageSquare,
  Brain,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: FileText,
      title: "Detailed Summary",
      desc: "Complete breakdown of every section, idea, and argument in your document.",
      tag: "In-Depth",
    },
    {
      icon: List,
      title: "Bullet Summary",
      desc: "Key ideas distilled into clean, scannable bullet points for fast review.",
      tag: "Scannable",
    },
    {
      icon: FileSearch,
      title: "Short Summary",
      desc: "One-paragraph overview that captures the full context instantly.",
      tag: "Quick Read",
    },
    {
      icon: Briefcase,
      title: "Executive Summary",
      desc: "Board-ready insight with structured, professional-level framing.",
      tag: "Professional",
    },
    {
      icon: MessageSquare,
      title: "Document Chat",
      desc: "Ask questions directly and get instant answers from your file.",
      tag: "Interactive",
    },
    {
      icon: Brain,
      title: "AI Learning Sets",
      desc: "Convert documents into structured study materials and knowledge sets.",
      tag: "Learning",
    },
  ];

  return (
    <section
      id="features"
      className="px-5 sm:px-8 md:px-12 py-16 md:py-25 max-w-275 mx-auto scroll-mt-20"
    >
      <div className="mb-12 md:mb-18 text-center">
        <div className="text-[11px] tracking-[0.2em] text-primary mb-4 font-sans">
          DOCUMENT INTELLIGENCE FEATURES
        </div>

        <h2 className="text-[clamp(28px,5vw,56px)] font-normal tracking-[-0.02em] font-serif">
          Turn any document into
          <br />
          <span className="text-text/35">actionable knowledge.</span>
        </h2>
      </div>

      {/* 2x3 GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/6">
        {features.map((feat, i) => {
          const Icon = feat.icon;

          return (
            <div
              key={i}
              className="px-6 sm:px-9 py-8 sm:py-10 bg-background transition-all duration-300 cursor-default relative overflow-hidden hover:bg-[rgba(31,41,55,0.6)]"
            >
              <div className="flex justify-between items-start mb-5 sm:mb-7">
                <Icon size={22} className="text-primary opacity-90" />

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
          );
        })}
      </div>
    </section>
  );
}

export default Features;
