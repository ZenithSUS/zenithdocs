import { GlobalMessage } from "@/types/global-message";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { markdownComponents, remarkGfm } from "../../../ui/markdownComponents";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import getConfidenceMessage from "@/utils/confidence-message";
import ConfidenceMessage from "./ConfidenceMessage";

interface GlobalMessageCardProps {
  globalMessage: GlobalMessage;
}

function GlobalMessageCard({ globalMessage: msg }: GlobalMessageCardProps) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const timestamp = new Date(msg.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex flex-col gap-1 min-w-0 w-full overflow-hidden">
      {/* Content */}
      {isUser ? (
        <p className="whitespace-pre-wrap text-[12px] leading-relaxed m-0">
          {msg.content}
        </p>
      ) : (
        <div className="min-w-0 overflow-x-auto text-[12px] leading-relaxed">
          <ReactMarkdown
            components={markdownComponents}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {msg.content}
          </ReactMarkdown>

          <ConfidenceMessage confidenceScore={msg.confidenceScore} />
        </div>
      )}

      {/* Timestamp + copy row */}
      <div
        className={`flex items-center gap-2 mt-1.5 ${
          isUser ? "justify-end" : "justify-between"
        }`}
      >
        <span
          className="text-[10px] tracking-wide shrink-0"
          style={{
            color: isUser ? "rgba(201,162,39,0.5)" : "rgba(255,255,255,0.2)",
          }}
        >
          {timestamp}
        </span>

        {!isUser && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md shrink-0
              transition-all duration-200 hover:bg-white/8 active:scale-90"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            aria-label="Copy message"
          >
            {copied ? (
              <>
                <Check size={10} style={{ color: "#4ade80" }} />
                <span className="text-[10px]" style={{ color: "#4ade80" }}>
                  Copied
                </span>
              </>
            ) : (
              <>
                <Copy size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span className="text-[10px] text-white/30">Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default GlobalMessageCard;
