import { Message } from "@/types/message";
import { markdownComponents, remarkGfm } from "../../ui/markdownComponents";
import { Sparkles, TrendingUp } from "lucide-react";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MessageCardProps {
  message: Message;
  email: string;
}

function MessageCard({ message: msg, email }: MessageCardProps) {
  return (
    <div
      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {msg.role === "assistant" && (
        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[85%] ${
          msg.role === "user"
            ? "bg-primary/10 border border-primary/20"
            : "bg-white/5 border border-white/10"
        } rounded-2xl px-4 py-3`}
      >
        <div
          className={`text-[13px] leading-[1.7] font-sans ${
            msg.role === "user" ? "text-text/90" : "text-text/80"
          }`}
        >
          {msg.role === "assistant" ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          )}
        </div>

        {/* Confidence score for AI messages */}
        {msg.role === "assistant" && msg.confidenceScore !== undefined && (
          <div className="mt-2 pt-2 border-t border-white/8 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-primary/70" />
            <span className="text-[9px] text-text/40 font-sans tracking-wider">
              CONFIDENCE: {Math.round(msg.confidenceScore * 100)}%
            </span>
          </div>
        )}

        <div className="text-[9px] text-text/30 font-sans mt-1.5 tracking-wider">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {msg.role === "user" && (
        <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
          <span className="text-[11px] text-text/70 font-sans font-medium">
            {email.slice(0, 1).toUpperCase() ?? "?"}
          </span>
        </div>
      )}
    </div>
  );
}

export default MessageCard;
