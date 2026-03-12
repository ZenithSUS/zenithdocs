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
import useGlobalMessage from "@/features/global-message/useGlobalMessage";
import useMessage from "@/features/message/useMessage";
import { AxiosError } from "@/types/api";
import { Trash2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface DeleteGlobalMessagesModalProps {
  chatId: string;
  disabled?: boolean;
}

function DeleteGlobalMessagesModal({
  chatId,
  disabled,
}: DeleteGlobalMessagesModalProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteGlobalMessageMutation } = useGlobalMessage(chatId);
  const { mutateAsync: deleteGlobalChatMessages } = deleteGlobalMessageMutation;

  const handleDeleteGlobalMessages = useCallback(async () => {
    setIsDeleting(true);

    try {
      await deleteGlobalChatMessages(chatId);
      toast.success("Global Messages deleted successfully!");
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.response?.data?.message || "Error deleting messages");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteGlobalChatMessages, chatId]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <AlertDialogTrigger asChild>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(239,68,68,0.12)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)")
            }
            disabled={isDeleting || disabled || !chatId}
            aria-label="Delete Global Messages"
          >
            <Trash2Icon size={14} color="red" />
          </button>
        </AlertDialogTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border-white/12">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text/90 font-serif text-[20px]">
            Clear all global messages?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text/50 font-sans text-[14px] pt-2">
            This action cannot be undone. This will permanently delete all
            global messages in this conversation.
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
            onClick={handleDeleteGlobalMessages}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteGlobalMessagesModal;
