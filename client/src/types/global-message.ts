export interface GlobalMessage {
  _id: string;
  chatId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  relatedDocumentIds?: string[];
  comparisonDocumentIds?: string[];
  embedding?: number[];
  confidenceScore?: number;
  createdAt: Date;
}
