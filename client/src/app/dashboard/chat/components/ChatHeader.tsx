import DeleteMessagesModal from "@/components/dashboard/modals/chat/DeleteMessagesModal";
import Doc from "@/types/doc";
import { ArrowLeft, FileText, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";

interface ChatHeaderProps {
  docId: string;
  chatId: string;
  documentData: Doc;
  options: {
    ref: React.RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

function ChatHeader({ docId, chatId, documentData, options }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <header className="relative z-50 border-b border-white/8 bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-2">
        <button
          onClick={() => router.push(`/dashboard/document/${docId}`)}
          className="flex items-center gap-2 text-text/50 hover:text-text/90 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] font-sans tracking-wider hidden sm:inline">
            BACK
          </span>
        </button>

        <div className="flex items-center gap-3 flex-1 justify-center max-w-md min-w-0">
          <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 text-center">
            <h1 className="text-[14px] font-serif text-text/90 truncate">
              {documentData.title}
            </h1>
            <p className="text-[10px] text-text/40 font-sans tracking-wider">
              DOCUMENT CHAT
            </p>
          </div>
        </div>

        <div className="relative" ref={options.ref}>
          <button
            onClick={() => options.setIsOpen(!options.isOpen)}
            className="p-2 rounded-lg text-text/50 hover:text-text/90 hover:bg-white/8 transition-all"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {options.isOpen && (
            <div className="absolute top-full right-0 mt-2 min-w-45 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1.5 overflow-hidden">
              <div className="px-3 py-1.5 mb-1">
                <span className="text-[10px] text-text/30 font-sans tracking-widest uppercase">
                  Options
                </span>
              </div>
              <div className="h-px bg-white/8 mb-1" />
              <DeleteMessagesModal
                chatId={chatId}
                documentId={docId}
                onAction={() => options.setIsOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
