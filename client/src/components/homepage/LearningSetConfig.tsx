import { Settings, BookOpen, CheckCircle, Layers, Zap } from "lucide-react";

const SET_TYPES = [
  { label: "Quiz", icon: CheckCircle },
  { label: "Reviewer", icon: BookOpen },
  { label: "Flashcards", icon: Layers },
];

const QUESTION_TYPES = [
  "General mix",
  "Multiple choice",
  "True / False",
  "Identification",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function LearningSetConfig() {
  return (
    <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
        <Settings size={14} className="text-white/40" />
        <span className="text-[11px] tracking-widest text-white/40 uppercase font-sans">
          Configuration
        </span>
      </div>

      <div className="p-4 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Title</label>
          <input
            placeholder="Midterms Reviewer — Chapter 4"
            className="w-full px-3 py-2 bg-white/3 border border-white/10 rounded-md text-sm text-white/70 outline-none placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Set type</label>
          <div className="flex flex-col gap-1.5">
            {SET_TYPES.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 border rounded-md ${
                  i === 0
                    ? "border-blue-500/40 bg-blue-500/8"
                    : "border-white/10"
                }`}
              >
                <item.icon
                  size={14}
                  className={i === 0 ? "text-blue-400" : "text-white/40"}
                />
                <span
                  className={`text-sm ${i === 0 ? "text-white/80" : "text-white/55"}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Question type</label>
          <div className="flex flex-wrap gap-1.5">
            {QUESTION_TYPES.map((q, i) => (
              <span
                key={q}
                className={`px-3 py-1 text-xs border rounded-md ${
                  i === 0
                    ? "border-blue-500/40 bg-blue-500/8 text-blue-300"
                    : "border-white/10 text-white/55"
                }`}
              >
                {q}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/40">Difficulty</label>
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((d, i) => (
              <span
                key={d}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-xs ${
                  i === 1
                    ? "border-blue-500/40 bg-blue-500/8 text-blue-300"
                    : "border-white/10 text-white/55"
                }`}
              >
                <Zap size={12} />
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-white/8 pt-4 flex flex-col gap-3">
          <p className="text-xs text-white/30">Select a document to continue</p>
          <button className="w-full py-2 text-sm border border-white/15 rounded-md text-white/60">
            Generate learning set
          </button>
        </div>
      </div>
    </div>
  );
}
