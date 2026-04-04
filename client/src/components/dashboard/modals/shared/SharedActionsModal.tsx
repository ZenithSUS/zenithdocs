import FileIcon from "@/components/FileIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentShare } from "@/types/document-share";
import {
  ArrowUpRight,
  Pencil,
  Trash2,
  Share,
  ShieldOff,
  ShieldCheck,
} from "lucide-react";

interface SharedActionsModalProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sharedDocument: DocumentShare;
  handleShareLinkCopy: () => void;
  handleEdit: () => void;
  handleToggleActive: () => void;
  handleNavigate: () => void;
  handleDelete: () => void;
  isOwner: boolean;
  isActive: boolean;
  isExpired: boolean;
}

function SharedActionsModal({
  dialogOpen,
  setDialogOpen,
  sharedDocument,
  handleShareLinkCopy,
  handleEdit,
  handleToggleActive,
  handleNavigate,
  handleDelete,
  isOwner,
  isActive,
  isExpired,
}: SharedActionsModalProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-sm  border-white/10 p-0 gap-0 rounded-2xl">
        <DialogHeader className="flex flex-row items-center gap-3 px-4 py-3 border-b border-white/[0.07] space-y-0 overflow-hidden">
          <div className="p-2 bg-white/6 rounded-lg shrink-0">
            <FileIcon type={sharedDocument.documentId.fileType} />
          </div>
          <div className="min-w-0 flex-1 text-left overflow-hidden">
            <DialogTitle className="text-sm font-semibold text-white/90 truncate block">
              {sharedDocument.documentId.title}
            </DialogTitle>
            <p className="text-xs text-white/40 truncate mt-0.5">
              {sharedDocument.ownerId.email}
            </p>
          </div>
        </DialogHeader>
        <DialogDescription className="text-sm text-white/70 px-4 py-2">
          Manage sharing settings and permissions for this document.
        </DialogDescription>

        <div className="p-2">
          {isOwner && (
            <>
              <button
                onClick={handleShareLinkCopy}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8 active:bg-white/10 transition-colors text-sm"
              >
                <Share size={16} className="shrink-0" />
                Copy share link
              </button>

              <button
                onClick={() => handleEdit()}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8 active:bg-white/10 transition-colors text-sm"
              >
                <Pencil size={16} className="shrink-0" />
                Edit share settings
              </button>
              <button
                onClick={() => handleToggleActive()}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-colors text-sm ${
                  isActive && !isExpired
                    ? "text-emerald-400 hover:bg-emerald-400/10 active:bg-emerald-400/15"
                    : "text-amber-400 hover:bg-amber-400/10 active:bg-amber-400/15"
                }`}
              >
                {isActive && !isExpired ? (
                  <ShieldOff size={16} className="shrink-0" />
                ) : (
                  <ShieldCheck size={16} className="shrink-0" />
                )}
                {isActive && !isExpired ? "Deactivate share" : "Activate share"}
              </button>
            </>
          )}

          <button
            onClick={handleNavigate}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8 active:bg-white/10 transition-colors text-sm"
          >
            <ArrowUpRight size={16} className="shrink-0" />
            Open document
          </button>

          <div className="mx-2 my-1 h-px bg-white/[0.07]" />

          {isOwner && (
            <button
              onClick={() => handleDelete()}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-400/10 active:bg-red-400/15 transition-colors text-sm"
            >
              <Trash2 size={16} className="shrink-0" />
              Delete share
            </button>
          )}
        </div>

        <div className="h-2" />
      </DialogContent>
    </Dialog>
  );
}

export default SharedActionsModal;
