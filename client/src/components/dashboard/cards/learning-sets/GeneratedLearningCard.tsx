import { LearningItem } from "@/types/learning-set";
import FlashCard from "@/components/dashboard/cards/learning-sets/FlashCard";
import IdentificationCard from "@/components/dashboard/cards/learning-sets/IdentificationCard";
import MCQCard from "@/components/dashboard/cards/learning-sets/MCQCard";
import TFCard from "@/components/dashboard/cards/learning-sets/TFCard";

interface GeneratedLearningCardProps {
  learningItem: LearningItem;
}

function GeneratedLearningCard({ learningItem }: GeneratedLearningCardProps) {
  switch (learningItem.type) {
    case "flashcard":
      return <FlashCard learningItem={learningItem} />;
    case "mcq":
      return <MCQCard learningItem={learningItem} />;
    case "tf":
      return <TFCard learningItem={learningItem} />;
    case "identification":
      return <IdentificationCard learningItem={learningItem} />;
    default:
      return null;
  }
}

export default GeneratedLearningCard;
