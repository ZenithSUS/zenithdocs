import { SummaryType } from "@/types/summary";
import { SUMMARY_TYPES } from "../summaryTypes";

interface Props {
  selected: SummaryType;
  disabled: boolean;
  onSelect: (type: SummaryType) => void;
}

const SummaryTypeSelector = ({ selected, disabled, onSelect }: Props) => (
  <div className="mb-8">
    <label className="text-[10px] tracking-[0.18em] text-[#C9A227]/70 mb-4 block font-sans">
      SELECT SUMMARY TYPE
    </label>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {SUMMARY_TYPES.map(({ type, icon, label, desc }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          disabled={disabled}
          className={`p-4 rounded-lg border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group ${
            selected === type
              ? "border-[#C9A227] bg-[#C9A227]/8"
              : "border-white/8 bg-[rgba(31,41,55,0.3)] hover:border-white/18"
          }`}
        >
          <div
            className={`mb-3 transition-colors ${
              selected === type
                ? "text-[#C9A227]"
                : "text-text/30 group-hover:text-text/50"
            }`}
          >
            {icon}
          </div>
          <div className="text-[13px] font-sans text-text/80 mb-1">{label}</div>
          <div className="text-[11px] text-text/35 font-sans leading-[1.6]">
            {desc}
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default SummaryTypeSelector;
