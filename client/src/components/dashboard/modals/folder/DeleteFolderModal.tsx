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
import { dashboardKeys } from "@/features/dashboard/dashboard.keys";
import useFolder from "@/features/folder/useFolder";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

interface DeleteFolderModalProps {
  userId: string;
  folderId: string;
}

function DeleteFolderModal({ userId, folderId }: DeleteFolderModalProps) {
  const queryClient = useQueryClient();

  const { deleteFolderMutation } = useFolder(userId);
  const { mutateAsync: deleteFolder } = deleteFolderMutation;

  const handleDelete = useCallback(async () => {
    try {
      await deleteFolder(folderId);
      await queryClient.refetchQueries({
        queryKey: dashboardKeys.overview(),
      });
      toast.success("Folder deleted successfully!");
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error deleting folder");
    }
  }, [deleteFolder, folderId]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 size={20} className="text-red-600 cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            folder.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteFolderModal;
