import {
  AlertTriangle,
  Building2,
  ChevronRight,
  Coins,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Summary, SummaryType } from "@/types/summary";

interface Props {
  summary: string;
  type: SummaryType;
  tokenUsed: number;
  additionalDetails: Summary["additionalDetails"] | null;
  isCreating: boolean;
  onRegenerate: () => void;
}

const SummaryResult = ({
  summary,
  type,
  tokenUsed,
  additionalDetails,
  isCreating,
  onRegenerate,
}: Props) => {
  const hasRisk =
    additionalDetails?.risk &&
    additionalDetails.risk !== "No significant risk identified";

  const hasAction =
    additionalDetails?.action &&
    additionalDetails.action !== "No immediate action required";

  const hasEntities =
    additionalDetails?.entity && additionalDetails.entity.length > 0;

  const hasAnyDetails = hasRisk || hasAction || hasEntities;

  return (
    <div className="space-y-3">
      {/* Summary card */}
      <div className="bg-white/5 border border-[#C9A227]/15 rounded-lg overflow-hidden">
        {/* Header strip */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/6">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-[#C9A227]" />
            <span className="text-[10px] tracking-[0.16em] text-[#C9A227] font-sans">
              {type.toUpperCase()} SUMMARY
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-text/25 font-sans">
            <Coins size={10} />
            {tokenUsed.toLocaleString()} tokens
          </div>
        </div>

        {/* Summary text */}
        <div className="px-6 py-5">
          <p className="text-[14px] text-text/70 font-sans leading-[1.9] whitespace-pre-line">
            {summary}
          </p>
        </div>

        {/* Additional details */}
        {hasAnyDetails && (
          <div className="mx-5 mb-5 rounded-md border border-white/6 bg-white/[0.018] overflow-hidden">
            {hasRisk && (
              <div className="flex items-start gap-4 px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-1.5 w-17 shrink-0 pt-px">
                  <AlertTriangle
                    size={10}
                    className="text-amber-400/70 shrink-0"
                  />
                  <span className="text-[9px] tracking-widest font-bold text-amber-400/70 font-sans uppercase">
                    Risk
                  </span>
                </div>
                <p className="text-[12.5px] text-text/55 font-sans leading-relaxed">
                  {additionalDetails!.risk}
                </p>
              </div>
            )}

            {hasAction && (
              <div
                className={`flex items-start gap-4 px-4 py-3 ${hasEntities ? "border-b border-white/5" : ""}`}
              >
                <div className="flex items-center gap-1.5 w-17 shrink-0 pt-px">
                  <ChevronRight
                    size={10}
                    className="text-emerald-400/70 shrink-0"
                  />
                  <span className="text-[9px] tracking-widest font-bold text-emerald-400/70 font-sans uppercase">
                    Action
                  </span>
                </div>
                <p className="text-[12.5px] text-text/55 font-sans leading-relaxed">
                  {additionalDetails!.action}
                </p>
              </div>
            )}

            {hasEntities && (
              <div className="flex items-start gap-4 px-4 py-3">
                <div className="flex items-center gap-1.5 w-17 shrink-0 pt-0.75">
                  <Building2 size={10} className="text-sky-400/70 shrink-0" />
                  <span className="text-[9px] tracking-widest font-bold text-sky-400/70 font-sans uppercase">
                    Entity
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {additionalDetails!.entity.map((e, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] text-text/50 font-sans bg-white/4 border border-white/8"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Regenerate */}
      <button
        onClick={onRegenerate}
        disabled={isCreating}
        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-sm text-[11.5px] font-bold tracking-[0.14em] font-sans border border-white/8 text-text/40 bg-transparent hover:border-white/18 hover:text-text/60 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <RotateCcw size={12} />
        REGENERATE
      </button>
    </div>
  );
};

export default SummaryResult;
