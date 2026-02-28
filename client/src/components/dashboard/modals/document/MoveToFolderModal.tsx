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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDocument from "@/features/documents/useDocument";
import useFolder from "@/features/folder/useFolder";
import { AxiosError } from "@/types/api";
import { FolderIcon } from "lucide-react";
import { useCallback, useState } from "react";
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

  const { updateDocumentMutation } = useDocument(userId, "");
  const { mutateAsync: updateDoc, isPending } = updateDocumentMutation;

  const { foldersByUserPage } = useFolder();
  const { data: foldersData } = foldersByUserPage(userId);

  const allFolders = foldersData?.pages.flatMap((page) => page.folders) || [];

  const handleMove = useCallback(async () => {
    try {
      if (!selectedFolder) return;

      const updateData = {
        id: documentId,
        data: {
          folder: selectedFolder === "none" ? undefined : selectedFolder,
        },
      };

      await updateDoc(updateData);

      toast.success("Document moved successfully!");
      onOpenChange(false);
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err?.response?.data?.message || "Error moving document");
      console.error("Error moving document:", error);
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
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-full bg-white/4 border-white/12 text-text/70 font-sans">
              <SelectValue placeholder="Select a folder" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/12">
              <SelectItem value="none" className="text-text/70 font-sans">
                No Folder
              </SelectItem>
              {allFolders.map((folder) => (
                <SelectItem
                  key={folder._id}
                  value={folder._id}
                  className="text-text/70 font-sans"
                >
                  <FolderIcon className="mr-2" size={16} color="#C9A227" />{" "}
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className="flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-sans tracking-wider font-bold bg-primary text-background hover:bg-[#e0b530]"
            disabled={isPending || selectedFolder === currentFolderId}
          >
            {isPending ? "Moving..." : "Move"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveToFolderModal;
