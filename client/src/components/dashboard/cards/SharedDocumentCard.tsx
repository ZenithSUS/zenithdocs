"use client";

import FileIcon from "@/components/FileIcon";
import { DocumentShare } from "@/types/document-share";
import {
  ArrowUpRight,
  Clock,
  Download,
  Eye,
  EyeClosed,
  EyeIcon,
  Share,
  ShieldCheck,
  ShieldOff,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { toast } from "sonner";

interface SharedDocumentCardProps {
  sharedDocument: DocumentShare;
}

function SharedDocumentCard({ sharedDocument }: SharedDocumentCardProps) {
  const router = useRouter();

  const isPublic = sharedDocument.type === "public";
  const isActive = sharedDocument.isActive;

  const expirationLabel = useMemo(() => {
    if (!sharedDocument.expiresAt) return "No expiry";
    const date = new Date(sharedDocument.expiresAt);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Expired";
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    if (days <= 7) return `Expires in ${days} days`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [sharedDocument.expiresAt]);

  const isExpired = useMemo(() => {
    if (!sharedDocument.expiresAt) return false;
    return new Date(sharedDocument.expiresAt).getTime() < Date.now();
  }, [sharedDocument.expiresAt]);

  const handleNavigate = useCallback(() => {
    if (isPublic) {
      router.push(`/document/share/${sharedDocument.shareToken}`);
    } else {
      router.push(`/document/${sharedDocument._id}`);
    }
  }, [sharedDocument, isPublic, router]);

  const handleShareLinkCopy = useCallback(() => {
    try {
      if (isPublic) {
        navigator.clipboard.writeText(
          window.location.origin +
            `/document/share/${sharedDocument.shareToken}`,
        );
      } else {
        navigator.clipboard.writeText(
          window.location.origin + `/document/${sharedDocument._id}`,
        );
      }
      toast.success("Link copied to clipboard");
    } catch {}
  }, [sharedDocument.shareToken]);

  const permission = isPublic
    ? sharedDocument.publicPermission
    : sharedDocument.allowedUsers?.[0]?.permission;

  return (
    <article
      onClick={handleNavigate}
      className="group relative bg-white/4 hover:bg-white/[0.07] border border-white/8 hover:border-white/15 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
    >
      {/* Status strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 transition-colors duration-300 ${
          !isActive || isExpired
            ? "bg-red-500/60"
            : isPublic
              ? "bg-amber-400/70"
              : "bg-emerald-400/70"
        }`}
      />

      <div className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 p-2 bg-white/6 rounded-lg">
              <FileIcon type={sharedDocument.documentId.fileType} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-white/90 truncate leading-snug">
                {sharedDocument.documentId.title}
              </p>
              <p className="text-xs text-white/40 mt-0.5 truncate">
                {sharedDocument.ownerId.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShareLinkCopy();
              }}
              className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
              aria-label="Share document"
            >
              <Share size={15} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
              aria-label="Open document"
            >
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Access type */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isPublic
                ? "bg-amber-400/10 text-amber-300 border-amber-400/20"
                : "bg-slate-400/10 text-slate-300 border-slate-400/20"
            }`}
          >
            {isPublic ? <EyeIcon size={11} /> : <EyeClosed size={11} />}
            {isPublic ? "Public" : "Private"}
          </span>

          {/* Status */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isActive && !isExpired
                ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
                : "bg-red-400/10 text-red-300 border-red-400/20"
            }`}
          >
            {isActive && !isExpired ? (
              <ShieldCheck size={11} />
            ) : (
              <ShieldOff size={11} />
            )}
            {isExpired ? "Expired" : isActive ? "Active" : "Inactive"}
          </span>

          {/* Permission */}
          {permission && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/6 text-white/50 border border-white/8 capitalize">
              {permission}
            </span>
          )}

          {/* Download */}
          {sharedDocument.allowDownload && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/6 text-white/50 border border-white/8">
              <Download size={11} />
              Downloadable
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/35">
              <Clock size={12} />
              <span
                className={`text-xs ${isExpired ? "text-red-400/70" : "text-white/35"}`}
              >
                {expirationLabel}
              </span>
            </div>

            <button
              className="flex items-center gap-1.5 text-white/35 lg:hidden"
              onClick={(e) => {
                e.stopPropagation();
                handleShareLinkCopy();
              }}
            >
              <Share size={12} />
              <span className="text-xs">Share Link</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              {sharedDocument.accessCount !== undefined && (
                <div className="flex items-center gap-1.5 text-white/35">
                  <Eye size={12} />
                  <span className="text-xs">
                    {sharedDocument.accessCount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/35">
                <User size={12} />
                <span className="text-xs">
                  {sharedDocument.allowedUsers?.length ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(SharedDocumentCard);
