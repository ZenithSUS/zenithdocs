import { JSX } from "react";
import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from "./upload.types";
import {
  FileText,
  FileType,
  AlignLeft,
  Paperclip,
  FileBarChart,
} from "lucide-react";

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

export const getFileIcon = (fileName: string): JSX.Element => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const props = { size: 24, strokeWidth: 1.5 };
  switch (ext) {
    case "pdf":
      return <FileType {...props} className="text-[#ef4444]/70" />;
    case "docx":
      return <FileText {...props} className="text-[#3b82f6]/70" />;
    case "txt":
      return <AlignLeft {...props} className="text-[#F5F5F5]/50" />;
    case "xlsx":
      return <FileBarChart {...props} className="text-[#10b981]/70" />;
    default:
      return <Paperclip {...props} className="text-[#C9A227]/70" />;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
