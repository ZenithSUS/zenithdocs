import {
  FileText,
  Zap,
  List,
  AlignLeft,
  Briefcase,
  Cpu,
  AlertTriangle,
  ChevronRight,
  Building2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

const SUMMARY_TYPES = [
  { icon: Zap, label: "Short", desc: "Concise overview of the key points" },
  {
    icon: List,
    label: "Bullet Points",
    desc: "Key takeaways in scannable list format",
  },
  {
    icon: AlignLeft,
    label: "Detailed",
    desc: "In-depth analysis with full context",
  },
  {
    icon: Briefcase,
    label: "Executive",
    desc: "High-level overview for decision makers",
  },
];

const ENTITIES = [
  "Stellar Dynamics Inc.",
  "Marcus T. Holloway (CEO)",
  "Evelyn Zhao (Legal)",
  "Delaware Corp.",
  "Net-60 Terms",
  "Auto-Renewal",
  "Arbitration",
  "SaaS",
];

export default function DocumentPreview() {
  return (
    <section className="px-5 sm:px-8 md:px-12 pb-20 md:pb-28 pt-10">
      <div className="text-center mb-10">
        <p className="text-[11px] tracking-widest text-primary uppercase font-sans mb-3">
          Document summary
        </p>
        <h2 className="text-[clamp(26px,4vw,44px)] font-normal tracking-[-0.02em] font-serif mb-4">
          Understand any document
          <br />
          <span className="text-text/35">in seconds.</span>
        </h2>
        <p className="text-[14px] text-text/40 font-sans max-w-sm mx-auto leading-relaxed">
          Choose a summary style and let AI extract what matters most from your
          files.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ── COLUMN 1 ── */}
        <div className="flex flex-col gap-3">
          <p className="text-[11px] tracking-widest text-white/30 uppercase font-sans">
            Select summary
          </p>

          <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col gap-5 p-5 sm:p-6">
            {/* File pill */}
            <div className="flex items-center gap-3 border border-white/10 rounded-md px-4 py-3 bg-white/5">
              <div className="w-9 h-9 rounded-md bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <FileText size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/80 font-sans">
                  enterprise_contract_2025.pdf
                </p>
                <p className="text-[11px] text-white/35 font-sans mt-0.5">
                  340 KB · Jan 15
                </p>
              </div>
            </div>

            {/* Label */}
            <p className="text-[11px] tracking-widest text-primary/60 uppercase font-sans -mb-2">
              Select summary type
            </p>

            {/* Type grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {SUMMARY_TYPES.map((t, i) => (
                <div
                  key={t.label}
                  className={`rounded-md border p-3.5 flex flex-col gap-2.5 ${
                    i === 0
                      ? "border-primary/50 bg-primary/8"
                      : "border-white/8 bg-white/3"
                  }`}
                >
                  <t.icon
                    size={16}
                    className={i === 0 ? "text-primary" : "text-white/40"}
                  />
                  <div>
                    <p
                      className={`text-sm font-sans font-medium ${i === 0 ? "text-white/90" : "text-white/60"}`}
                    >
                      {t.label}
                    </p>
                    <p className="text-[11px] text-white/35 font-sans mt-0.5 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="w-full py-3 rounded-md bg-primary text-black text-[11px] tracking-widest uppercase font-sans font-semibold flex items-center justify-center gap-2">
              <Cpu size={13} />
              Generate summary
            </button>

            {/* Tip */}
            <div className="flex items-start gap-2.5 border border-white/8 rounded-md px-3.5 py-3 bg-white/3">
              <Lightbulb
                size={13}
                className="text-primary/50 mt-0.5 shrink-0"
              />
              <p className="text-[11px] text-white/40 font-sans leading-relaxed">
                <span className="text-white/60 font-medium">Tip:</span>{" "}
                Different summary types are optimized for different audiences.
                Short gives a quick overview, bullet points are great for
                scanning, detailed provides full context, and executive focuses
                on business impact.
              </p>
            </div>
          </div>
        </div>

        {/* ── COLUMN 2 ── */}
        <div className="flex flex-col gap-3">
          <p className="text-[11px] tracking-widest text-white/30 uppercase font-sans">
            Result
          </p>

          <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col gap-4 p-5 sm:p-6">
            {/* File pill */}
            <div className="flex items-center gap-3 border border-white/10 rounded-md px-4 py-3 bg-white/5">
              <div className="w-9 h-9 rounded-md bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <FileText size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/80 font-sans">
                  enterprise_contract_2025.pdf
                </p>
                <p className="text-[11px] text-white/35 font-sans mt-0.5">
                  340 KB · Jan 15
                </p>
              </div>
            </div>

            {/* Summary header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={13} className="text-primary/60" />
                <span className="text-[11px] tracking-widest text-primary/60 uppercase font-sans">
                  Short summary
                </span>
              </div>
              <span className="text-[11px] text-white/25 font-sans">
                3,142 tokens
              </span>
            </div>

            {/* Body text */}
            <p className="text-[13px] text-white/60 font-sans leading-relaxed">
              Stellar Dynamics Inc. has entered a 3-year SaaS licensing
              agreement with Net-60 payment terms and an automatic renewal
              clause effective March 2025. The contract includes liability caps
              at 2× annual fees, mandatory arbitration for disputes, and data
              residency requirements under Delaware jurisdiction. Early
              termination carries a 20% penalty fee.
            </p>

            {/* Insight rows */}
            <div className="flex flex-col divide-y divide-white/6 border border-white/8 rounded-md overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/3">
                <div className="flex items-center gap-1.5 min-w-20 shrink-0">
                  <AlertTriangle size={12} className="text-yellow-400" />
                  <span className="text-[11px] text-yellow-400 uppercase tracking-wider font-sans">
                    Risk
                  </span>
                </div>
                <span className="text-[12px] text-white/55 font-sans">
                  Auto-renewal triggers unless cancelled 60 days prior
                </span>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-white/3">
                <div className="flex items-center gap-1.5 min-w-20 shrink-0">
                  <ChevronRight size={12} className="text-primary" />
                  <span className="text-[11px] text-primary uppercase tracking-wider font-sans">
                    Action
                  </span>
                </div>
                <span className="text-[12px] text-white/55 font-sans">
                  Schedule renewal review before January 1, 2026
                </span>
              </div>

              <div className="flex items-start gap-3 px-4 py-3 bg-white/3">
                <div className="flex items-center gap-1.5 min-w-20 shrink-0 mt-0.5">
                  <Building2 size={12} className="text-blue-300" />
                  <span className="text-[11px] text-blue-300 uppercase tracking-wider font-sans">
                    Entity
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ENTITIES.map((e) => (
                    <span
                      key={e}
                      className="px-2 py-0.5 text-[10px] border border-white/10 rounded text-white/50 font-sans bg-white/3"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Regenerate */}
            <button className="w-full py-2.5 rounded-md border border-white/10 bg-white/3 text-[11px] tracking-widest uppercase text-white/45 font-sans flex items-center justify-center gap-2">
              <RefreshCw size={12} />
              Regenerate
            </button>

            {/* Tip */}
            <div className="flex items-start gap-2.5 border border-white/8 rounded-md px-3.5 py-3 bg-white/3">
              <Lightbulb
                size={13}
                className="text-primary/50 mt-0.5 shrink-0"
              />
              <p className="text-[11px] text-white/40 font-sans leading-relaxed">
                <span className="text-white/60 font-medium">Tip:</span>{" "}
                Different summary types are optimized for different audiences.
                Short gives a quick overview, bullet points are great for
                scanning, detailed provides full context, and executive focuses
                on business impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
