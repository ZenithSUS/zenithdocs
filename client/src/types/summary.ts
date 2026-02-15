export type SummaryType = "short" | "bullet" | "detailed" | "executive";

export interface Summary {
  _id: string;
  document: string;
  type: SummaryType;
  content: string;
  tokensUsed: number;
  createdAt: string;
}
