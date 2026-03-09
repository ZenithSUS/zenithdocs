"use client";

import FileIcon from "@/components/FileIcon";
import { SUMMARY_ICONS } from "../tabs/summary/summaryIcons";
import { Summary } from "@/types/summary";
import sizefmt from "@/helpers/size-format";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Building2, ChevronRight, EyeIcon } from "lucide-react";

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

  const ad = s.additionalDetails;
  const hasRisk = ad?.risk && ad.risk !== "No significant risk identified";
  const hasAction = ad?.action && ad.action !== "No immediate action required";
  const hasEntities = ad?.entity && ad.entity.length > 0;
  const hasAnyDetails = hasRisk || hasAction || hasEntities;

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

        {/* Additional Details */}
        {hasAnyDetails && (
          <div className="rounded border border-white/6 bg-white/[0.018] overflow-hidden mt-1">
            {hasRisk && (
              <div
                className={`flex items-start gap-3 px-3 py-2.5 ${hasAction || hasEntities ? "border-b border-white/5" : ""}`}
              >
                <div className="flex items-center gap-1 w-14.5 shrink-0 pt-px">
                  <AlertTriangle
                    size={9}
                    className="text-amber-400/65 shrink-0"
                  />
                  <span className="text-[8.5px] tracking-widest font-bold text-amber-400/65 font-sans uppercase">
                    Risk
                  </span>
                </div>
                <p className="text-[11.5px] text-text/50 font-sans leading-relaxed line-clamp-2">
                  {ad!.risk}
                </p>
              </div>
            )}

            {hasAction && (
              <div
                className={`flex items-start gap-3 px-3 py-2.5 ${hasEntities ? "border-b border-white/5" : ""}`}
              >
                <div className="flex items-center gap-1 w-14.5 shrink-0 pt-px">
                  <ChevronRight
                    size={9}
                    className="text-emerald-400/65 shrink-0"
                  />
                  <span className="text-[8.5px] tracking-widest font-bold text-emerald-400/65 font-sans uppercase">
                    Action
                  </span>
                </div>
                <p className="text-[11.5px] text-text/50 font-sans leading-relaxed line-clamp-2">
                  {ad!.action}
                </p>
              </div>
            )}

            {hasEntities && (
              <div className="flex items-start gap-3 px-3 py-2.5">
                <div className="flex items-center gap-1 w-14.5 shrink-0 pt-0.75">
                  <Building2 size={9} className="text-sky-400/65 shrink-0" />
                  <span className="text-[8.5px] tracking-widest font-bold text-sky-400/65 font-sans uppercase">
                    Entity
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ad!.entity.slice(0, 4).map((e, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-px rounded-sm text-[10px] text-text/45 font-sans bg-white/4 border border-white/7"
                    >
                      {e}
                    </span>
                  ))}
                  {ad!.entity.length > 4 && (
                    <span className="px-1.5 py-px text-[10px] text-text/30 font-sans">
                      +{ad!.entity.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
