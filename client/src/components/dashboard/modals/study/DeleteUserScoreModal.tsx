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
import { Button } from "@/components/ui/button";
import useUserScore from "@/features/user-score/useUserScore";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

interface DeleteUserScoreModalProps {
  id: string;
  userId: string;
  learningSetId: string;
  title: string | undefined;
}

function DeleteUserScoreModal({
  id,
  userId,
  learningSetId,
  title,
}: DeleteUserScoreModalProps) {
  const { deleteUserScoreMutation } = useUserScore(userId, learningSetId);

  const handleDelete = useCallback(async () => {
    try {
      await deleteUserScoreMutation.mutateAsync(id);
      toast.success("User score reset successfully!");
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error deleting user score");
    }
  }, [deleteUserScoreMutation, id]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex items-center gap-2 py-2.5 rounded-sm cursor-pointer tracking-widest font-semibold hover:text-black bg-red-500 hover:bg-red-500/90 text-xs font-sans transition-all duration-200 uppercase">
          <Trash2 size={20} />
          Reset Score
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will reset the user score of{" "}
            {title ?? "this learning set"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="text-black">
            Reset Score
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUserScoreModal;
