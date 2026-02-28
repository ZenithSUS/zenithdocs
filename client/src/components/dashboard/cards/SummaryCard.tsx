"use client";

import FileIcon from "@/components/FileIcon";
import { SUMMARY_ICONS } from "../tabs/Summary";
import { Summary } from "@/types/summary";
import sizefmt from "@/helpers/size-format";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

interface SummaryCardProps {
  summary: Summary;
}

function SummaryCard({ summary: s }: SummaryCardProps) {
  const router = useRouter();

  const doc = typeof s.document === "object" ? s.document : null;
  const fileType = doc?.fileType ?? "txt";
  const title = doc?.title ?? "Unknown document";

  const documentId =
    s.document && typeof s.document === "object" ? s.document._id : null;

  return (
    <div className="border border-white/8 rounded-sm overflow-hidden hover:border-primary/20 transition-colors duration-200 flex flex-col">
      {/* Card header */}
      <div className="px-5 py-3 border-b border-white/6 bg-white/2 flex items-center gap-2">
        <span className="text-primary text-[15px]">
          {SUMMARY_ICONS[s.type]}
        </span>
        <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
          {s.type.toUpperCase()}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] text-text/25 font-sans">
            {s.tokensUsed} tokens
          </span>
          <span className="text-[10px] text-text/20 font-sans">
            {sizefmt.date(s.createdAt)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        {/* Document row */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 text-[11px] text-text/30 font-sans">
            <span className="shrink-0">
              <FileIcon type={fileType} />
            </span>
            <span className="truncate">{title}</span>
          </div>

          {documentId && (
            <Button
              variant="link"
              onClick={() =>
                router.push(`/dashboard/document/${documentId.toString()}`)
              }
              className="shrink-0 flex items-center gap-1.5 p-0 h-auto text-[11px]"
            >
              <EyeIcon size={13} />
              View
            </Button>
          )}
        </div>

        {/* Summary content */}
        <p className="text-[13px] text-text/65 font-sans leading-[1.7] whitespace-pre-line line-clamp-4">
          {s.content}
        </p>
      </div>
    </div>
  );
}

export default SummaryCard;
