import sizefmt from "@/helpers/size-format";
import FileIcon from "../FileIcon";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface DocumentPrivateHeaderProps {
  title: string | null;
  fileSize: number | null;
  fileType: string | null;
}

function DocumentPrivateHeader({
  title,
  fileSize,
  fileType,
}: DocumentPrivateHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky z-10 border-b border-white/6 top-0 px-8 sm:px-12 py-3 sm:py-4 backdrop-blur-sm flex items-center justify-between gap-3 bg-background/90 min-w-0">
      <div className="flex items-center gap-3">
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
