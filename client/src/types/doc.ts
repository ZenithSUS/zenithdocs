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
        title: string;
      }
    | null;
  type: string;
  createdAt: string;
}

export default Doc;
