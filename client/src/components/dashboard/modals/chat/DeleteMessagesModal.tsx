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
import useChat from "@/features/chat/useChat";
import { AxiosError } from "@/types/api";
import { Trash2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface DeleteMessagesModalProps {
  id: string;
  userId: string;
  documentId: string;
  onAction?: () => void;
}

function DeleteMessagesModal({
  id,
  userId,
  documentId,
  onAction,
}: DeleteMessagesModalProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteChatMessagesMutation } = useChat(userId);
  const { mutateAsync: deleteChatMessages } = deleteChatMessagesMutation;

  const handleDeleteMessages = useCallback(async () => {
    setIsDeleting(true);

    try {
      await deleteChatMessages({ id, documentId });
      toast.success("Messages deleted successfully!");
      setOpen(false);
      onAction?.();
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.response?.data?.message || "Error deleting messages");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteChatMessages, id, documentId]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <AlertDialogTrigger asChild>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-400/80 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 group z-1000">
            <Trash2Icon size={14} className="shrink-0" />
            <span className="text-[13px] font-sans">Clear Messages</span>
          </button>
        </AlertDialogTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border-white/12">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text/90 font-serif text-[20px]">
            Clear all messages?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text/50 font-sans text-[14px] pt-2">
            This action cannot be undone. This will permanently delete all
            messages in this conversation.
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
            className="flex-1 cursor-pointer font-sans tracking-wider font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              console.log("Deleting messages...");
              handleDeleteMessages();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteMessagesModal;
