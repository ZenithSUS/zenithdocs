import { X } from "lucide-react";
import DeleteGlobalMessagesModal from "../../modals/globalchat/DeleteGlobalMessagesModal";

interface GlobalChatHeaderProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping: boolean;
  isProcessing: boolean;
  chatId: string;
}

function GlobalChatHeader({
  setIsOpen,
  isTyping,
  isProcessing,
  chatId,
}: GlobalChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(201,162,39,0.12)",
            border: "1px solid rgba(201,162,39,0.22)",
          }}
        >
          <span style={{ color: "#C9A227", fontSize: 15 }}>◈</span>
        </div>
        <div className="leading-none">
          <div className="text-[13px] font-bold tracking-widest font-serif text-white/90">
            ZENITH<span style={{ color: "#C9A227" }}>DOCS</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{
                boxShadow: "0 0 5px rgba(52,211,153,0.7)",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            <span className="text-[10px] text-white/25 tracking-widest font-mono uppercase">
              Global Chat
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <DeleteGlobalMessagesModal chatId={chatId} disabled={isTyping} />
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={isTyping || isProcessing}
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
          aria-label="Close chat"
        >
          <X size={14} color="rgba(239,68,68,0.8)" />
        </button>
      </div>
    </div>
  );
}

export default GlobalChatHeader;
