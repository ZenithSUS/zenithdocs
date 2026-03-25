import sizefmt from "@/helpers/size-format";
import { ArrowLeft, Download, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import FileIcon from "../FileIcon";
import { toast } from "sonner";

interface DocumentPublicHeaderProps {
  title: string | null;
  fileSize: number | null;
  fileType: string | null;
  fileUrl: string | null;
  isDownloadable: boolean;
}

function DocumentPublicHeader({
  title,
  fileSize,
  fileType,
  fileUrl,
  isDownloadable,
}: DocumentPublicHeaderProps) {
  const router = useRouter();

  const handleDownload = () => {
    if (!fileUrl) return;
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = title ?? "dowmnload";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {}
  };

  return (
    <div className="px-8 py-3 sm:py-4 sm:px-12 flex justify-between items-center gap-3 bg-background/90 min-w-0 border-b border-white/8 sticky top-0 z-10">
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
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text/50 hover:text-text/90 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] font-sans tracking-wider hidden sm:inline">
            BACK
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 border-l border-primary" />

        {/* Logo — always visible, never shrinks */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[18px] sm:text-[20px] text-primary">◈</span>
          <span className="text-[13px] sm:text-[15px] font-bold tracking-[0.08em] font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>
      </div>

      {/* Document info */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <div className="flex items-center gap-3">
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

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          className="shrink-0 flex items-center gap-2 text-text/50 hover:text-text/90 transition-colors bg-primary hover:bg-primary/20 rounded-full p-2"
          title="Copy link"
        >
          <Link className="hover:text-primary cursor-pointer" size={16} />
        </button>
      </div>
    </div>
  );
}

export default DocumentPublicHeader;
