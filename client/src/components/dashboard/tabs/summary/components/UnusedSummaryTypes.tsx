import { SummaryType } from "@/types/summary";
import { SUMMARY_ICONS } from "@/constants/summary-icons";

interface Props {
  unusedTypes: SummaryType[];
}

const UnusedSummaryTypes = ({ unusedTypes }: Props) => {
  if (unusedTypes.length === 0) return null;

  return (
    <div className="border-t border-white/6 pt-5 mt-8">
      <div className="text-[10px] tracking-[0.15em] text-text/25 font-sans mb-4">
        AVAILABLE SUMMARY TYPES
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {unusedTypes.map((t) => (
          <div
            key={t}
            className="border border-white/5 border-dashed rounded-sm px-4 py-6 text-center"
          >
            <div className="text-[20px] text-text/10 mb-2">
              {SUMMARY_ICONS[t]}
            </div>
            <div className="text-[10px] text-text/20 font-sans tracking-wider capitalize">
              {t}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnusedSummaryTypes;
