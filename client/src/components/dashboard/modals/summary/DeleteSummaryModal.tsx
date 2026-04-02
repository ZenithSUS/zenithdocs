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
import useSummary from "@/features/summary/useSummary";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

interface DeleteSummaryModalProps {
  userId: string;
  summaryId: string;
  documentId: string;
}

function DeleteSummaryModal({
  userId,
  summaryId,
  documentId,
}: DeleteSummaryModalProps) {
  const queryClient = useQueryClient();
  const { deleteSummaryMutation } = useSummary(userId, documentId);
  const { mutateAsync: deleteSummary } = deleteSummaryMutation;

  const handleDelete = useCallback(async () => {
    try {
      await deleteSummary(summaryId);
      await queryClient.refetchQueries({
        queryKey: dashboardKeys.overview(),
      });
      toast.success("Summary deleted successfully!");
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error deleting summary");
    }
  }, [deleteSummary, summaryId]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 size={20} className="text-red-600 cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            summary.
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

export default DeleteSummaryModal;
