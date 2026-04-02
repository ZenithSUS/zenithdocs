import { LearningSet } from "@/types/learning-set";
import {
  BadgeQuestionMark,
  BookOpenCheck,
  Grid2x2Plus,
  WalletCards,
} from "lucide-react";
import { JSX } from "react";

interface StudyInfoPanelProps {
  learningSet: LearningSet | null | undefined;
  totalItems: number;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-green-400/10 text-green-300 border border-green-500/40",
  medium: "bg-amber-400/10 text-amber-300 border border-amber-500/40",
  hard: "bg-red-400/10 text-red-300 border border-red-500/40",
};

const TYPE_LABELS: Record<string, string> = {
  quiz: "Quiz",
  reviewer: "Reviewer",
  flashcard: "Flashcard",
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice",
  tf: "True / False",
  identification: "Identification",
  flashcard: "Flashcard",
};

const ITEM_TYPE_GLYPHS: Record<string, JSX.Element> = {
  mcq: <Grid2x2Plus className="w-4 h-4" />,
  tf: <BookOpenCheck className="w-4 h-4" />,
  identification: <BadgeQuestionMark className="w-4 h-4" />,
  flashcard: <WalletCards className="w-4 h-4" />,
};

function ArcRing({ percent, color }: { percent: number; color: string }) {
  const r = 26;
  const cx = 34;
  const cy = 34;
  const circ = 2 * Math.PI * r; // ≈ 163.36
  const filled = (percent / 100) * circ;
  const gap = circ - filled;

  return (
    <svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      className="shrink-0 -rotate-90"
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="rgba(201, 162, 39, 0.25)"
        strokeWidth="5"
      />
      {/* Fill */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}
const ARC_COLORS = ["var(--color-accent)", "#60a5fa", "#a78bfa", "#34d399"];

function StudyInfoPanel({ learningSet, totalItems }: StudyInfoPanelProps) {
  if (!learningSet) return null;

  const difficulty = learningSet.difficulty ?? "easy";
  const type = learningSet.type ?? "quiz";
  const createdAt = new Date(learningSet.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const breakdownItems = (["mcq", "tf", "identification", "flashcard"] as const)
    .map((itemType, i) => ({
      itemType,
      count: learningSet.items.filter((item) => item.type === itemType).length,
      percent:
        totalItems > 0
          ? Math.round(
              (learningSet.items.filter((item) => item.type === itemType)
                .length /
                totalItems) *
                100,
            )
          : 0,
      color: ARC_COLORS[i],
    }))
    .filter((d) => d.count > 0);

  return (
    <div className="flex flex-col pb-4 px-4">
      {/* ── MASTHEAD ─────────────────────────────────── */}
      <div className="border-b border-border pb-5 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted mb-2">
              Learning Set
            </p>
            <h1 className="text-3xl font-black text-text leading-[1.1] tracking-tight wrap-break-word">
              {learningSet.title ?? "Untitled"}
            </h1>
          </div>
          {/* Large index glyph — editorial touch */}
          <span
            className="text-[5rem] font-black leading-none text-text/5 select-none shrink-0 -mt-2"
            aria-hidden
          >
            {String(totalItems).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${DIFFICULTY_STYLES[difficulty]}`}
          >
            {difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-accent/10 text-accent">
            {TYPE_LABELS[type] ?? type}
          </span>
        </div>
      </div>

      {/* ── METADATA STRIP ───────────────────────────── */}
      <dl className="grid grid-cols-2 gap-y-4 mb-5">
        {[
          { label: "Total Items", value: totalItems },
          { label: "Format", value: TYPE_LABELS[type] ?? type },
          { label: "Created", value: createdAt, full: true },
        ].map(({ label, value, full }) => (
          <div
            key={label}
            className={`flex flex-col gap-0.5 border-l-2 border-accent/40 pl-3 ${full ? "col-span-2" : ""}`}
          >
            <dt className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted">
              {label}
            </dt>
            <dd className="text-sm font-bold text-text">{value}</dd>
          </div>
        ))}
      </dl>

      {/* ── BREAKDOWN ────────────────────────────────── */}
      {breakdownItems.length > 0 && (
        <div className="border-t border-border pt-5">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted mb-4">
            Item Breakdown
          </p>

          <div className="flex flex-col gap-4">
            {breakdownItems.map(({ itemType, count, percent, color }) => (
              <div key={itemType} className="flex items-center gap-4">
                <div className="relative shrink-0 w-17 h-17">
                  <ArcRing percent={percent} color={color} />
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-text">
                    {percent}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color }}
                      aria-hidden
                    >
                      {ITEM_TYPE_GLYPHS[itemType]}
                    </span>
                    <span className="text-xs font-bold text-text uppercase tracking-wide">
                      {ITEM_TYPE_LABELS[itemType]}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted">
                    {count} {count === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER RULE ──────────────────────────────── */}
      <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[9px] tracking-[0.25em] uppercase text-muted/50 font-semibold">
          End of Info
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}

export default StudyInfoPanel;
