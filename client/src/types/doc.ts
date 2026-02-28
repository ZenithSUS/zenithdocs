export type DocStatus = "uploaded" | "processing" | "completed" | "failed";

export interface Doc {
  _id: string;
  title: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
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

export type CreateDoc = Omit<Doc, "_id" | "createdAt" | "updatedAt"> & {
  file?: File;
};

export default Doc;
