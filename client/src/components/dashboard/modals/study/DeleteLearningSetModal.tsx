"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useLearningSet from "@/features/learning-sets/useLearningSet";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface DeleteLearningSetModalProps {
  userId: string;
  page: number;
  learningSetId: string;
  defaultOpen?: boolean;
  onClose?: () => void;
}

function DeleteLearningSetModal({
  userId,
  page,
  learningSetId,
  defaultOpen = false,
  onClose,
}: DeleteLearningSetModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  const { deleteLearningSetMutation } = useLearningSet(userId, page);
  const { mutateAsync: deleteLearningSet, isPending: isDeleting } =
    deleteLearningSetMutation;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) onClose?.();
    },
    [onClose],
  );

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await deleteLearningSet(learningSetId);
        toast.success("Learning set deleted successfully!");
        handleOpenChange(false);
      } catch (error) {
        const err = error as AxiosError;
        handleApiError(err, "Error deleting learning set");
      }
    },
    [deleteLearningSet, learningSetId, handleOpenChange],
  );

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {!defaultOpen && (
        <AlertDialogTrigger asChild>
          <Trash2 className="w-6 h-6 text-red-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-0.5 group-hover:translate-y-0 hover:bg-white/10 p-1.5 rounded-lg" />
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            learning set.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteLearningSetModal;
