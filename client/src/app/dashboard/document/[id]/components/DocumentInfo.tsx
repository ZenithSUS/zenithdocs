import { useRouter } from "next/navigation";
import {
  Download,
  MessageCircle,
  Sparkles,
  CalendarDays,
  Folder,
  HardDrive,
} from "lucide-react";

import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";

interface StatusMeta {
  text: string;
  dot: string;
  label: string;
}

interface DocumentFolder {
  name: string;
}

interface Document {
  title: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  fileUrl?: string;
  status: string;
}

interface Props {
  documentId: string;
  document: Document;
  folder: DocumentFolder | null;
  statusMeta: StatusMeta;
}

const DocumentInfo = ({ documentId, document, folder, statusMeta }: Props) => {
  const router = useRouter();

  return (
    <div className="bg-white/8 border border-[#C9A227]/18 rounded-lg p-6 sm:p-8 mb-8">
      {/* Title row */}
      <div className="flex items-start gap-4 mb-6">
        <div className="text-4xl">
          <FileIcon type={document.fileType} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-normal mb-2 wrap-break-word">
            {document.title}
          </h2>
          <div className="flex flex-wrap gap-3 text-[12px] text-[#F5F5F5]/40 font-sans">
            {folder && (
              <span className="flex items-center gap-1.5">
                <Folder size={11} className="text-[#C9A227]" />
                {folder.name}
              </span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <HardDrive size={11} />
              {sizefmt.bytes(document.fileSize)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={11} />
              {sizefmt.date(document.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-white/8">
        <div
          className={`flex items-center gap-2 text-[12px] font-sans ${statusMeta.text}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${statusMeta.dot} ${
              document.status === "processing" ? "animate-pulse" : ""
            }`}
          />
          {statusMeta.label}
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
          {document.fileUrl && (
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-green-500 border border-white/10 font-bold text-black rounded-sm text-[11px] tracking-widest font-sans hover:bg-white/8 transition-colors"
            >
              <Download size={12} />
              DOWNLOAD
            </a>
          )}
          <button
            onClick={() =>
              router.push(`/dashboard/summarize?doc=${documentId}`)
            }
            className="flex items-center gap-1.5 px-4 py-2 bg-[#C9A227] text-[#111111] rounded-sm text-[11px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors"
          >
            <Sparkles size={12} />
            SUMMARIZE
          </button>
          <button
            onClick={() => router.push(`/dashboard/chat?doc=${documentId}`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-text font-sans hover:bg-accent rounded-sm text-[11px] font-bold tracking-widest transition-colors"
          >
            <MessageCircle size={12} />
            CHAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;
