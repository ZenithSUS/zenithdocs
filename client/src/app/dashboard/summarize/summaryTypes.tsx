import { Zap, List, FileText, Briefcase } from "lucide-react";
import { SummaryType } from "@/types/summary";

interface SummaryTypeOption {
  type: SummaryType;
  icon: React.ReactNode;
  label: string;
  desc: string;
}

export const SUMMARY_TYPES: SummaryTypeOption[] = [
  {
    type: "short",
    icon: <Zap size={16} />,
    label: "Short",
    desc: "Concise overview of the key points",
  },
  {
    type: "bullet",
    icon: <List size={16} />,
    label: "Bullet Points",
    desc: "Key takeaways in scannable list format",
  },
  {
    type: "detailed",
    icon: <FileText size={16} />,
    label: "Detailed",
    desc: "In-depth analysis with full context",
  },
  {
    type: "executive",
    icon: <Briefcase size={16} />,
    label: "Executive",
    desc: "High-level overview for decision makers",
  },
];
