import { BookOpen, Layers, Target } from "lucide-react";
import type { LearningSetInput } from "@/types/learning-set";

type SetType = LearningSetInput["type"];

const SET_TYPES: {
  value: SetType;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    value: "quiz",
    label: "Quiz",
    icon: <Target className="w-4 h-4" />,
    desc: "Test your knowledge with scored questions",
  },
  {
    value: "reviewer",
    label: "Reviewer",
    icon: <BookOpen className="w-4 h-4" />,
    desc: "Study-mode with explanations and hints",
  },
  {
    value: "flashcard",
    label: "Flashcards",
    icon: <Layers className="w-4 h-4" />,
    desc: "Spaced-repetition memory cards",
  },
];

export default SET_TYPES;
