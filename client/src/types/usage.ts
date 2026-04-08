export interface Usage {
  _id: string;
  user: string;
  month: string;
  aiRequests: number;
  dailyMessages: Record<string, number>;
  documentsUploaded: number;
  storageUsed: number;
  tokensUsed: number;
  totalMessages: number;
}

export type DailyMessagesUsage = Pick<
  Usage,
  "_id" | "user" | "month" | "dailyMessages"
>;
