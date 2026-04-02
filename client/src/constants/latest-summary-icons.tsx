import { Zap, List, FileText, Briefcase } from "lucide-react";
import { SummaryType } from "@/types/summary";

export const LASTEST_SUMMARY_ICONS: Record<SummaryType, React.ReactNode> = {
  short: <Zap size={14} />,
  bullet: <List size={14} />,
  detailed: <FileText size={14} />,
  executive: <Briefcase size={14} />,
};
