import Doc from "./doc";

export interface Folder {
  _id: string;
  name: string;
  user:
    | string
    | {
        _id: string;
        email: string;
      };
  createdAt: string;
  updatedAt?: string;
}

export type FolderWithDocuments = Folder & {
  documents: Pick<
    Doc,
    | "_id"
    | "title"
    | "status"
    | "fileSize"
    | "fileType"
    | "createdAt"
    | "folder"
  >[];
  documentCount: number;
  completedCount: number;
  uploadedCount: number;
  processingCount: number;
  failedCount: number;
};
