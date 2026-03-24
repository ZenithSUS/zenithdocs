import DeleteMessagesModal from "@/components/dashboard/modals/chat/DeleteMessagesModal";
import useDropdown from "@/features/ui/useDropdown";
import { Link2, MessageSquare, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface DocumentPrivateChatHeaderProps {
  documentId: string;
  chatId: string;
}

function DocumentPrivateChatHeader({
  documentId,
  chatId,
}: DocumentPrivateChatHeaderProps) {
  const options = useDropdown();
  const { ref: optionsRef, isOpen, setIsOpen } = options;

  const handleCopy = async () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {}
  };

  return (
    <div className="shrink-0 border-b border-white/8 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-[13px] font-serif text-text/90">
              Chat with Document
            </h2>
            <p className="text-[10px] text-text/40 font-sans tracking-wider">
              ASK QUESTIONS ABOUT THIS DOCUMENT
            </p>
          </div>
        </div>

        <div className="relative">
          <MoreHorizontal
            onClick={() => setIsOpen(!isOpen)}
            size={20}
            className="text-text/40 mr-10"
          />

          {isOpen && (
            <div
              ref={optionsRef}
              className="absolute top-3 right-0  mt-2 w-50 rounded-sm bg-background border border-white/6 flex flex-col gap-3 px-3 py-2 shadow-md"
            >
              <button
                className="flex items-center gap-3 cursor-pointer hover:bg-white/20 py-2 px-3 rounded-sm"
                onClick={handleCopy}
              >
                <Link2 className="w-4 h-4 text-text/40" />
                <p className="text-xs text-text/50">Copy link</p>
              </button>
              <div className="hover:bg-red-500/8 transition-all duration-150 py-2 px-3 rounded-sm">
                <DeleteMessagesModal documentId={documentId} chatId={chatId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentPrivateChatHeader;
