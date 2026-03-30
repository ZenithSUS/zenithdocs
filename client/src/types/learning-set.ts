export interface LearningItem {
  type: "mcq" | "tf" | "identification" | "flashcard";
  question?: string;
  choices?: string[];
  answer: string;
  explanation?: string;
  front?: string;
  back?: string;
}

export interface LearningSet {
  _id: string;
  documentId: string;
  ownerId: string;
  type: "quiz" | "reviewer" | "flashcard";
  title?: string;
  difficulty: "easy" | "medium" | "hard";
  items: LearningItem[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningSetInput {
  ownerId: string;
  documentId: string;
  type: "quiz" | "reviewer" | "flashcard";
  itemType: "general" | "mcq" | "tf" | "identification" | "flashcard";
  title?: string;
  difficulty: "easy" | "medium" | "hard";
}
