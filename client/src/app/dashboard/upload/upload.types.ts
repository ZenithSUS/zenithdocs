export interface UploadFile {
  id: string;
  file: File;
  status: "processing" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export const ACCEPTED_FORMATS = [".pdf", ".docx", ".txt", ".xlsx"] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
