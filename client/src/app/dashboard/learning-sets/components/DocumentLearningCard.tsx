"use client";

import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";
import Doc from "@/types/doc";
import { CheckCircle2 } from "lucide-react";

interface DocumentLearningCardProps {
  document: Doc;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

function DocumentLearningCard({
  document,
  selected = false,
  onClick,
  disabled = false,
}: DocumentLearningCardProps) {
  const uploadedAt = document.createdAt
    ? new Date(document.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group w-full text-left transition-all duration-200 ease-out
        flex items-center gap-3 px-3.5 py-3 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed
        ${
          selected
            ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_0_1px_rgba(245,158,11,0.2)]"
            : "bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/15"
        }
      `}
    >
      {/* File Icon */}
      <div
        className={`
        shrink-0 flex items-center justify-center w-9 h-9 rounded-md
        transition-colors duration-200
        ${selected ? "bg-amber-500/15" : "bg-white/6 group-hover:bg-white/10"}
      `}
      >
        <FileIcon type={document.fileType} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`
          text-sm font-medium truncate leading-snug transition-colors duration-200
          ${selected ? "text-amber-300" : "text-text/85 group-hover:text-text/95"}
        `}
        >
          {document.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-text/40">
            {document.fileSize > 0
              ? sizefmt.bytes(document.fileSize)
              : "Unknown size"}
          </span>
          {uploadedAt && (
            <>
              <span className="text-text/20 text-[10px]">•</span>
              <span className="text-[11px] text-text/35">{uploadedAt}</span>
            </>
          )}
        </div>
      </div>

      {/* Selected check */}
      <div
        className={`
        shrink-0 transition-all duration-200
        ${selected ? "opacity-100 scale-100" : "opacity-0 scale-75"}
      `}
      >
        <CheckCircle2 className="w-4.5 h-4.5 text-amber-400" />
      </div>
    </button>
  );
}

export default DocumentLearningCard;
