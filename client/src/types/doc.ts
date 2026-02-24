export type DocStatus = "uploaded" | "processing" | "completed" | "failed";

export interface Doc {
  _id: string;
  title: string;
  fileType: string;
  fileSize: number;
  status: DocStatus;
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

export default Doc;
