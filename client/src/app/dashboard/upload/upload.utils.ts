import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from "./upload.types";

export const validateFile = (file: File): string | null => {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ACCEPTED_FORMATS.includes(ext as (typeof ACCEPTED_FORMATS)[number])) {
    return `Invalid format. Only ${ACCEPTED_FORMATS.join(", ")} allowed.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File too large. Maximum size is 10MB.";
  }
  return null;
};

export const getFileIcon = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "📄";
    case "docx":
      return "📝";
    case "txt":
      return "📃";
    default:
      return "📎";
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
