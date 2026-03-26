export interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  confidenceScore?: number;
  createdAt: Date;
}

export interface Chat {
  _id: string;
  documentId: string;
  userId: string;
  messages: Message[];
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageInput {
  documentId: string;
  question: string;
}

export interface PublicMessageInput {
  shareToken: string;
  question: string;
  history: { role: "user" | "assistant"; content: string }[];
}
