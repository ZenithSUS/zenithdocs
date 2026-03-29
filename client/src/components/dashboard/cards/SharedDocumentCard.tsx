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
  MoreVertical,
  Pencil,
  Share,
  ShieldCheck,
  ShieldOff,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import SharedActionsModal from "../modals/shared/SharedActionsModal";
import DeleteSharedModal from "../modals/shared/DeleteShareModal";
import EditShareDocumentModal from "../modals/shared/EditSharedModal";

interface SharedDocumentCardProps {
  sharedDocument: DocumentShare;
  onToggleActive?: (id: string, current: boolean) => void;
  isTogglePending?: boolean;
}

function SharedDocumentCard({
  sharedDocument,
  onToggleActive,
  isTogglePending = false,
}: SharedDocumentCardProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const isPublic = sharedDocument.type === "public";
  const isActive = sharedDocument.isActive;

  const documentInfo = {
    ...sharedDocument.documentId,
    id: sharedDocument.documentId._id,
  };

  const expirationLabel = useMemo(() => {
    if (!sharedDocument.expiresAt) return "No expiry";

    const date = new Date(sharedDocument.expiresAt);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return "Expired";

    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isSameDay) return "Expires today";

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 1) return "Expires tomorrow";
    if (days <= 7) return `Expires in ${days} days`;

    return `Expires on ${date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
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
      const path = isPublic
        ? `/document/share/${sharedDocument.shareToken}`
        : `/document/${sharedDocument._id}`;
      navigator.clipboard.writeText(window.location.origin + path);
      toast.success("Link copied to clipboard");
    } catch {}
    setDialogOpen(false);
  }, [sharedDocument, isPublic]);

  const handleToggleActive = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onToggleActive?.(sharedDocument._id, !isActive);
      setDialogOpen(false);
    },
    [sharedDocument._id, isActive, onToggleActive],
  );

  const handleDelete = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setDeleteDialogOpen(true);
      setDialogOpen(false);
    },
    [sharedDocument._id],
  );

  const handleEdit = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();

      setEditDialogOpen(true);
      setDialogOpen(false);
    },
    [sharedDocument],
  );

  const permission = isPublic
    ? sharedDocument.publicPermission
    : sharedDocument.allowedUsers?.[0]?.permission;

  return (
    <>
      {dialogOpen && (
        <SharedActionsModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          sharedDocument={sharedDocument}
          handleShareLinkCopy={handleShareLinkCopy}
          handleEdit={handleEdit}
          handleToggleActive={handleToggleActive}
          handleNavigate={handleNavigate}
          handleDelete={handleDelete}
          isActive={isActive}
          isExpired={isExpired}
        />
      )}

      {deleteDialogOpen && (
        <DeleteSharedModal
          userId={sharedDocument.ownerId._id}
          documentShareId={sharedDocument._id}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      )}

      {editDialogOpen && (
        <EditShareDocumentModal
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          documentShare={sharedDocument}
          documentInfo={documentInfo}
          userId={sharedDocument.ownerId._id}
        />
      )}

      <article
        onClick={handleNavigate}
        className="group relative bg-white/4 hover:bg-white/[0.07] border border-white/8 hover:border-white/15 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 select-none"
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

            <div className="flex items-center gap-1 shrink-0">
              {/* Tablet + desktop hover action icons (lg and above) */}
              <div className="hidden lg:flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareLinkCopy();
                  }}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
                  aria-label="Copy share link"
                  title="Copy share link"
                >
                  <Share size={14} />
                </button>

                <button
                  onClick={handleEdit}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
                  aria-label="Edit share settings"
                  title="Edit share settings"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={handleToggleActive}
                  className={`p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 disabled:cursor-not-allowed ${
                    isActive && !isExpired
                      ? "text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-400/10"
                      : "text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
                  }`}
                  aria-label={isActive ? "Deactivate share" : "Activate share"}
                  title={isActive ? "Deactivate share" : "Activate share"}
                  disabled={isExpired || isTogglePending}
                >
                  {isActive && !isExpired ? (
                    <ShieldCheck size={14} />
                  ) : (
                    <ShieldOff size={14} />
                  )}
                </button>

                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
                  aria-label="Delete share"
                  title="Delete share"
                >
                  <Trash2 size={14} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate();
                  }}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
                  aria-label="Open document"
                  title="Open document"
                >
                  <ArrowUpRight size={14} />
                </button>
              </div>

              {/* Mobile + small tablet 3-dot button (below lg) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDialogOpen(true);
                }}
                className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 active:bg-white/15 transition-colors"
                aria-label="More actions"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex items-center flex-wrap gap-2">
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

            {permission && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/6 text-white/50 border border-white/8 capitalize">
                {permission}
              </span>
            )}

            {sharedDocument.allowDownload && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/6 text-white/50 border border-white/8">
                <Download size={11} />
                Downloadable
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.07]">
            <div className="flex items-center gap-1.5 text-white/35">
              <Clock size={12} />
              <span
                className={`text-xs ${isExpired ? "text-red-400/70" : "text-white/35"}`}
              >
                {expirationLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {sharedDocument.accessCount !== undefined && (
                <div className="flex items-center gap-1.5 text-white/35">
                  <Eye size={12} />
                  <span className="text-xs">
                    {sharedDocument.accessCount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-white/35">
                <User size={12} />
                <span className="text-xs">
                  {sharedDocument.allowedUsers?.length ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default memo(SharedDocumentCard);
