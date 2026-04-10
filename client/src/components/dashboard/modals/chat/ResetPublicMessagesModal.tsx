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
import { Trash2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ResetPublicMessagesModalProps {
  onAction: () => void;
}

function ResetPublicMessagesModal({ onAction }: ResetPublicMessagesModalProps) {
  const [open, setOpen] = useState(false);
  const [isResetMessages, setIsResetMessages] = useState(false);

  const handleResetMessages = useCallback(async () => {
    setIsResetMessages(true);

    onAction();
    toast.success("Messages reset successfully!");
    setOpen(false);

    setIsResetMessages(false);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <AlertDialogTrigger asChild>
          <button className="w-full flex items-center gap-3 cursor-pointer text-left text-red-400/80 hover:text-red-400  group z-1000">
            <Trash2Icon size={14} className="shrink-0" />
            <span className="text-[13px] font-sans">Reset Messages</span>
          </button>
        </AlertDialogTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border-white/12">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text/90 font-serif text-[20px]">
            Reset all messages?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text/50 font-sans text-[14px] pt-2">
            This action cannot be undone. This will reset all messages in public
            chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-3">
          <AlertDialogCancel
            className="flex-1 cursor-pointer font-sans tracking-wider"
            disabled={isResetMessages}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 cursor-pointer font-sans tracking-wider font-bold text-black disabled:opacity-50"
            onClick={handleResetMessages}
            disabled={isResetMessages}
          >
            {isResetMessages ? "Resetting..." : "Reset Messages"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ResetPublicMessagesModal;
