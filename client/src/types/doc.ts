import { Chat } from "./chat";

export type DocStatus = "uploaded" | "processing" | "completed" | "failed";

export interface Doc {
  _id: string;
  title: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  rawText: string;
  status: DocStatus;
  user: string;
  folder?:
    | string
    | {
        _id: string;
        name: string;
      }
    | null;
  createdAt: string;
  updatedAt?: string;
}

export type DocWithChat = Doc & {
  chat:
    | (Omit<Chat, "rawText"> & {
        messageCount: number;
        lastMessage: {
          content: string;
          role: "user" | "assistant";
        } | null;
      })
    | null;
};

export type CreateDoc = Omit<Doc, "_id" | "createdAt" | "updatedAt"> & {
  file?: File;
};

export type DocumentShareInfo = Pick<
  Doc,
  "title" | "fileUrl" | "fileSize" | "fileType" | "rawText"
> & { id: string };

export default Doc;
