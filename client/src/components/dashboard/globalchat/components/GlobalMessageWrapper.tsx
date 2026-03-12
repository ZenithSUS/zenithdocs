import { GlobalMessage } from "@/types/global-message";
import { Sparkles } from "lucide-react";
import { StreamingBubble } from "../hooks/useGlobalMessageStream";

interface GlobalMessageWrapperProps {
  children: React.ReactNode;
  idx: number;
  message: GlobalMessage;
  messageSize: number;
  userInitial: string;
  streamingBubble: StreamingBubble | null;
}

function GlobalMessageWrapper({
  children,
  idx,
  message: msg,
  userInitial,
  messageSize,
  streamingBubble,
}: GlobalMessageWrapperProps) {
  const isUser = msg.role === "user";
  const isLast = idx === messageSize - 1;
  return (
    <div
      key={msg._id ?? idx}
      className={`flex gap-2 min-w-0 ${isUser ? "justify-end" : "justify-start"}`}
      style={{
        animation:
          isLast && !streamingBubble ? "fadeSlideIn 0.25s ease-out" : "none",
      }}
    >
      {!isUser && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
          style={{
            background: "rgba(201,162,39,0.1)",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <Sparkles size={11} style={{ color: "#C9A227" }} />
        </div>
      )}

      <div
        className={`flex gap-1 min-w-0 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`relative min-w-0 overflow-hidden rounded-xl px-3 py-2 text-[12px] leading-relaxed
                          ${isUser ? "text-white/90 rounded-tr-sm" : "text-white/70 rounded-tl-sm"}`}
          style={
            isUser
              ? {
                  background: "rgba(201,162,39,0.14)",
                  border: "1px solid rgba(201,162,39,0.22)",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }
          }
        >
          {children}
        </div>
      </div>

      {isUser && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 text-[10px] font-semibold text-white/50"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {userInitial}
        </div>
      )}
    </div>
  );
}

export default GlobalMessageWrapper;
