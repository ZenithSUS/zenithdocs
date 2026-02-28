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
import { AxiosError } from "@/types/api";
import { useCallback } from "react";
import { toast } from "sonner";

interface DeleteDocumentModalProps {
  documentId: string;
  documentTitle: string;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DeleteDocumentModal = ({
  documentId,
  documentTitle,
  userId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDocumentModalProps) => {
  const { deleteDocumentMutation } = useDocument(userId, "");
  const { mutateAsync: deleteDoc, isPending } = deleteDocumentMutation;

  const handleDelete = useCallback(async () => {
    try {
      await deleteDoc(documentId);
      toast.success("Document deleted successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.response.data.message || "Error deleting document");
    }
  }, [documentId, deleteDoc, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-white/12">
        <DialogHeader>
          <DialogTitle className="text-text/90 font-serif text-[20px]">
            Delete Document?
          </DialogTitle>
          <DialogDescription className="text-text/50 font-sans text-[14px] pt-2">
            Are you sure you want to delete{" "}
            <span className="text-text/70 font-medium">{documentTitle}</span>?
            This action cannot be undone and will also delete all associated
            summaries.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-3 pt-4">
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
            onClick={handleDelete}
            className="flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-sans tracking-wider font-bold bg-red-500 hover:bg-red-600"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocumentModal;
