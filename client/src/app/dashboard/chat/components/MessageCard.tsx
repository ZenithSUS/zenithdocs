import { markdownComponents } from "@/components/ui/markdownComponents";
import { Message } from "@/types/chat";
import { Sparkles } from "lucide-react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface MessageCardProps {
  message: Message;
}

function MessageCard({ message: msg }: MessageCardProps) {
  return (
    <div
      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
        msg.role === "user"
          ? "bg-primary/10 border border-primary/20"
          : "bg-white/5 border border-white/10"
      }`}
    >
      <div
        className={`text-[14px] leading-[1.8] font-sans ${msg.role === "user" ? "text-text/90" : "text-text/80"}`}
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
      <div className="text-[10px] text-text/30 font-sans mt-2 tracking-wider">
        {new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

export default MessageCard;
