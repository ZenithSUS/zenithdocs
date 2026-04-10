import { Layers, ScrollText } from "lucide-react";

interface Props {
  active: "details" | "summaries";
  summaryCount: number;
  onSelect: (tab: "details" | "summaries") => void;
}

const DocumentTabs = ({ active, summaryCount, onSelect }: Props) => (
  <div className="mb-6 flex gap-1 p-1 bg-white/4 border border-white/8 rounded-sm w-fit">
    <button
      onClick={() => onSelect("details")}
      className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${
        active === "details"
          ? "bg-primary text-black font-bold"
          : "text-text/50 hover:text-text/70"
      }`}
    >
      <ScrollText size={12} />
      DETAILS
    </button>
    <button
      onClick={() => onSelect("summaries")}
      className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${
        active === "summaries"
          ? "bg-primary text-black font-bold"
          : "text-text/50 hover:text-text/70"
      }`}
    >
      <Layers size={12} />
      SUMMARIES ({summaryCount})
    </button>
  </div>
);

export default DocumentTabs;
