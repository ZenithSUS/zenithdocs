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
import { dashboardKeys } from "@/features/dashboard/dashboard.keys";
import useDocument from "@/features/documents/useDocument";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
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
}: DeleteDocumentModalProps) => {
  const queryClient = useQueryClient();
  const { deleteDocumentMutation } = useDocument(userId, "");
  const { mutateAsync: deleteDoc, isPending } = deleteDocumentMutation;

  const handleDelete = useCallback(async () => {
    try {
      await deleteDoc(documentId);
      toast.success("Document deleted successfully!");
      onOpenChange(false);
      await queryClient.refetchQueries({
        queryKey: dashboardKeys.overview(),
      });
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error deleting document");
    }
  }, [documentId, deleteDoc, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-white/12">
        <DialogHeader>
          <DialogTitle className="text-text/90 font-serif text-[20px]">
            Delete Document?
          </DialogTitle>
          <DialogDescription className="text-text/50 font-sans text-[14px] pt-2 wrap-break-word">
            Are you sure you want to delete{" "}
            <span className="text-text/70 font-medium break-all">
              {documentTitle}
            </span>
            ? This action cannot be undone and will also delete all associated
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
