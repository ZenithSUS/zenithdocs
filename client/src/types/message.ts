export interface Message {
  _id: string;
  chatId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  confidenceScore?: number;
  createdAt: Date;
}
