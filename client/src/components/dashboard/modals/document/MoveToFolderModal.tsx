import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDocument from "@/features/documents/useDocument";
import { useFolderByUserPage } from "@/features/folder/useFolderByUserPage";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { FolderIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { toast } from "sonner";

interface MoveToFolderModalProps {
  documentId: string;
  documentTitle: string;
  currentFolderId?: string | null;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MoveToFolderModal = ({
  documentId,
  documentTitle,
  currentFolderId,
  userId,
  open,
  onOpenChange,
  onSuccess,
}: MoveToFolderModalProps) => {
  const [selectedFolder, setSelectedFolder] = useState<string>(
    currentFolderId || "none",
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { updateDocumentMutation } = useDocument(userId);
  const { mutateAsync: updateDoc, isPending } = updateDocumentMutation;

  const {
    data: foldersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFolderByUserPage(userId);

  const allFolders = foldersData?.pages.flatMap((page) => page.folders) || [];

  const options = [{ _id: "none", name: "No Folder" }, ...allFolders];
  const selectedName =
    options.find((f) => f._id === selectedFolder)?.name ?? "Select a folder";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMove = useCallback(async () => {
    try {
      if (!selectedFolder) return;

      await updateDoc({
        id: documentId,
        data: { folder: selectedFolder === "none" ? null : selectedFolder },
      });

      toast.success("Document moved successfully!");
      onOpenChange(false);
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error moving document");
    } finally {
      if (onSuccess) onSuccess();
    }
  }, [documentId, selectedFolder, updateDoc, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-white/12">
        <DialogHeader>
          <DialogTitle className="text-text/90 font-serif text-[20px]">
            Move to Folder
          </DialogTitle>
          <DialogDescription className="text-text/50 font-sans text-[14px] pt-2">
            Move{" "}
            <span className="text-text/70 font-medium">{documentTitle}</span> to
            a different folder.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-[11px] tracking-[0.15em] text-primary mb-3 block font-sans">
            SELECT DESTINATION FOLDER
          </label>

          <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center justify-between w-full px-4 py-2.5 bg-white/4 border border-white/12 rounded text-text/70 text-sm font-sans hover:border-primary/30 focus:outline-none transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {selectedFolder !== "none" && (
                  <FolderIcon size={14} color="#C9A227" />
                )}
                {selectedName}
              </span>
              <svg
                className={`w-4 h-4 text-text/40 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#1a1a1a] border border-white/12 rounded shadow-xl overflow-hidden">
                <div className="max-h-52 overflow-y-auto">
                  {options.map((f) => (
                    <button
                      key={f._id}
                      onClick={() => {
                        setSelectedFolder(f._id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-sans flex items-center gap-2 transition-colors duration-100 ${
                        selectedFolder === f._id
                          ? "bg-primary/15 text-primary"
                          : "text-text/60 hover:bg-white/6 hover:text-text/80"
                      }`}
                    >
                      {f._id !== "none" && (
                        <FolderIcon size={14} color="#C9A227" />
                      )}
                      {f.name}
                    </button>
                  ))}
                </div>

                {/* Load more */}
                {hasNextPage && (
                  <div className="border-t border-white/6">
                    {isFetchingNextPage ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-text/40 font-sans">
                        <span>Loading</span>
                        <ThreeDot size="small" color="#c9a227" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchNextPage();
                        }}
                        className="w-full px-4 py-2.5 text-sm text-text/40 font-sans hover:text-primary hover:bg-white/4 transition-colors duration-150 text-center"
                      >
                        Load more
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-sans tracking-wider"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleMove}
            className="flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-sans tracking-wider font-bold bg-primary text-background text-black"
            disabled={
              isPending || selectedFolder === (currentFolderId ?? "none")
            }
          >
            {isPending ? "Moving..." : "Move"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveToFolderModal;
