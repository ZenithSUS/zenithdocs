import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useDocumentShare from "@/features/document-share/useDocumentShare";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface DeleteSharedModalProps {
  userId: string;
  documentShareId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function DeleteSharedModal({
  userId,
  documentShareId,
  open,
  setOpen,
}: DeleteSharedModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteDocumentShareMutation } = useDocumentShare(userId);
  const { mutateAsync: deleteDocumentShare } = deleteDocumentShareMutation;

  const handleDeleteSharedDocument = useCallback(async () => {
    setIsDeleting(true);

    try {
      await deleteDocumentShare(documentShareId);
      toast.success("Shared document deleted successfully!");
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error deleting shared document");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteDocumentShare, documentShareId]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-background border-white/12">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text/90 font-serif text-[20px]">
            Delete this shared document?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text/50 font-sans text-[14px] pt-2">
            This action cannot be undone. This will permanently delete this
            shared document and revoke access for all collaborators.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-3">
          <AlertDialogCancel
            className="flex-1 cursor-pointer font-sans tracking-wider"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 cursor-pointer font-sans tracking-wider font-bold text-black disabled:opacity-50"
            onClick={handleDeleteSharedDocument}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteSharedModal;
