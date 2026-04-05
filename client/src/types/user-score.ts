export interface UserScore {
  _id: string;
  userId: string;
  learningSetId: string;
  score: number;
  total: number;
  correct: number;
  completedAt: Date;
  history: { itemId: string; answeredAt: Date; correct: boolean }[];
}

export interface UserScoreInput {
  userId: string;
  learningSetId: string;
  score: number;
  total: number;
  correct: number;
  completedAt?: Date;
  history: { itemId: string; answeredAt: Date; correct: boolean }[];
}
