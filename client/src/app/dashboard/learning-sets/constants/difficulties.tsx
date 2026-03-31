import { LearningSetInput } from "@/types/learning-set";
import { BrainCircuit, Flame, Zap } from "lucide-react";

type Difficulty = LearningSetInput["difficulty"];

const DIFFICULTIES: {
  value: Difficulty;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    icon: <Zap className="w-3.5 h-3.5" />,
    color:
      "text-emerald-400 border-emerald-500/40 bg-emerald-500/10 data-[active=true]:bg-emerald-500/20 data-[active=true]:border-emerald-400/60",
  },
  {
    value: "medium",
    label: "Medium",
    icon: <Flame className="w-3.5 h-3.5" />,
    color:
      "text-amber-400 border-amber-500/40 bg-amber-500/10 data-[active=true]:bg-amber-500/20 data-[active=true]:border-amber-400/60",
  },
  {
    value: "hard",
    label: "Hard",
    icon: <BrainCircuit className="w-3.5 h-3.5" />,
    color:
      "text-rose-400 border-rose-500/40 bg-rose-500/10 data-[active=true]:bg-rose-500/20 data-[active=true]:border-rose-400/60",
  },
];

export default DIFFICULTIES;
