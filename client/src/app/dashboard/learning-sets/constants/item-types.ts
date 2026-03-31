import type { LearningSetInput } from "@/types/learning-set";

type ItemType = LearningSetInput["itemType"];

const ITEM_TYPES: { value: ItemType; label: string }[] = [
  { value: "general", label: "General Mix" },
  { value: "mcq", label: "Multiple Choice" },
  { value: "tf", label: "True / False" },
  { value: "identification", label: "Identification" },
  { value: "flashcard", label: "Flashcard" },
];

export default ITEM_TYPES;
