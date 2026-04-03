import { LearningItem } from "@/types/learning-set";
import FlashCard from "@/components/dashboard/cards/learning-sets/FlashCard";
import IdentificationCard from "@/components/dashboard/cards/learning-sets/IdentificationCard";
import MCQCard from "@/components/dashboard/cards/learning-sets/MCQCard";
import TFCard from "@/components/dashboard/cards/learning-sets/TFCard";

interface GeneratedLearningCardProps {
  learningItem: LearningItem;
  isStudying?: boolean;
  setPoints?: (points: number) => void;
}

function GeneratedLearningCard({
  learningItem,
  isStudying,
  setPoints,
}: GeneratedLearningCardProps) {
  switch (learningItem.type) {
    case "flashcard":
      return (
        <FlashCard
          learningItem={learningItem}
          isStudying={isStudying}
          setPoints={setPoints}
        />
      );
    case "mcq":
      return (
        <MCQCard
          learningItem={learningItem}
          isStudying={isStudying}
          setPoints={setPoints}
        />
      );
    case "tf":
      return (
        <TFCard
          learningItem={learningItem}
          isStudying={isStudying}
          setPoints={setPoints}
        />
      );
    case "identification":
      return (
        <IdentificationCard
          learningItem={learningItem}
          isStudying={isStudying}
          setPoints={setPoints}
        />
      );
    default:
      return null;
  }
}

export default GeneratedLearningCard;
