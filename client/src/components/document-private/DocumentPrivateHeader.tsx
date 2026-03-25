import sizefmt from "@/helpers/size-format";
import FileIcon from "../FileIcon";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";

interface DocumentPrivateHeaderProps {
  title: string | null;
  fileSize: number | null;
  fileType: string | null;
  fileUrl: string | null;
  isDownloadable: boolean;
}

function DocumentPrivateHeader({
  title,
  fileSize,
  fileType,
  fileUrl,
  isDownloadable,
}: DocumentPrivateHeaderProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleDownload = () => {
    if (!fileUrl) return;
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = title ?? "download";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBack = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.back();
  };

  return (
    <div className="sticky z-10 border-b border-white/6 top-0 px-8 sm:px-12 py-3 sm:py-4 backdrop-blur-sm flex items-center justify-between gap-3 bg-background/90 min-w-0">
      <div className="flex items-center gap-3">
        {/* Download button */}
        {isDownloadable && (
          <button
            onClick={handleDownload}
            className="shrink-0 flex items-center gap-2 text-text/50 hover:text-text/90 transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5 hover:text-primary cursor-pointer" />
          </button>
        )}

        {/* Back button */}
        <button
          onClick={handleBack}
          disabled={isNavigating}
          className="flex items-center gap-2 text-text/50 hover:text-text/90 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] font-sans tracking-wider hidden sm:inline">
            BACK
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 border-l border-primary" />

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[18px] sm:text-[20px] text-primary">◈</span>
          <span className="text-[13px] sm:text-[15px] font-bold tracking-[0.08em] font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>
      </div>

      {/* Document info + download */}
      <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
        {/* Icon */}
        <div className="shrink-0 hidden sm:block">
          <FileIcon type={fileType ?? "N/A"} />
        </div>

        <div className="flex flex-col min-w-0">
          <p
            className="text-[12px] sm:text-[13px] font-semibold truncate max-w-40 xs:max-w-[220px] sm:max-w-95 md:max-w-none"
            title={title ?? "Untitled"}
          >
            {title || "Untitled"}
          </p>
          <p className="text-[10px] sm:text-[11px] text-text/50 font-sans">
            {sizefmt.bytes(fileSize ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DocumentPrivateHeader;
