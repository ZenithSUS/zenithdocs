import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { MessageSquare, FileText, Clock } from "lucide-react";
import { DocWithChat } from "@/types/doc";

interface ChatCardProps {
  documentChat: DocWithChat;
}

function ChatCard({ documentChat }: ChatCardProps) {
  const router = useRouter();
  const { chat } = documentChat;

  const messageCount = chat?.messageCount ?? 0;
  const rawLastMessage = chat?.lastMessage?.content ?? "No messages";
  const lastMessageRole = chat?.lastMessage?.role ?? "";
  const hasMessages = chat?.messageCount ? chat?.messageCount > 0 : false;

  const lastMessage = useMemo(() => {
    return rawLastMessage
      .replace(/#{1,6}\s+/g, "") // headings (#, ##, ###, etc.)
      .replace(/\*\*(.+?)\*\*/g, "$1") // bold (**text**)
      .replace(/\*(.+?)\*/g, "$1") // italic (*text*)
      .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline & fenced code
      .replace(/^[-*]\s+/gm, "") // bullet points
      .replace(/^\d+\.\s+/gm, "") // numbered lists
      .replace(/^-{3,}$/gm, "") // horizontal rules (---)
      .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links → label only
      .replace(/\n{2,}/g, " ") // collapse blank lines
      .replace(/\n/g, " ") // remaining newlines → space
      .trim();
  }, [rawLastMessage]);

  const handleNavigateToChat = useCallback(() => {
    router.push(`/dashboard/chat?doc=${documentChat._id}`);
  }, [documentChat._id, router]);

  return (
    <div
      onClick={handleNavigateToChat}
      className="group relative p-5 bg-white/5 border border-white/10 rounded-lg hover:border-primary/30 hover:bg-white/8 transition-all duration-200 cursor-pointer"
    >
      {/* Document Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-serif text-text/90 truncate mb-1">
            {documentChat.title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-text/40 font-sans">
            <MessageSquare className="w-3 h-3" />
            <span>
              {messageCount} message{messageCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Last Message Preview */}
      {hasMessages ? (
        <div className="mb-4">
          <p className="text-[12px] text-text/50 font-sans line-clamp-2 leading-relaxed">
            {lastMessageRole === "user" ? "You: " : "AI: "}
            {lastMessage}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-[12px] text-text/30 font-sans italic">
            No messages yet
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/8">
        <div className="flex items-center gap-1.5 text-[10px] text-text/30 font-sans">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(chat?.updatedAt ?? Date.now()).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <span className="text-[11px] text-primary/0 group-hover:text-primary font-sans tracking-wider transition-colors">
          OPEN →
        </span>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-lg bg-linear-to-br from-primary/5 to-transparent" />
      </div>
    </div>
  );
}

export default ChatCard;
