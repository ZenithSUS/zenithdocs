import { Sparkles } from "lucide-react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "@/components/ui/markdownComponents";
import { StreamingBubble } from "../hooks/useMessageStream";
import ConfidenceMessage from "./ConfidenceMessage";

interface StreamingBubbleCardProps {
  streamingBubble: StreamingBubble;
  confidenceScore: number;
}

function StreamingBubbleCard({
  streamingBubble,
  confidenceScore,
}: StreamingBubbleCardProps) {
  return (
    <div className="flex gap-4 justify-start">
      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
        <div className="text-[14px] leading-[1.8] font-sans text-text/80">
          {!streamingBubble.content ? (
            <div className="flex gap-1.5 py-1">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="min-w-0 overflow-x-auto">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {streamingBubble.content}
              </ReactMarkdown>
              <ConfidenceMessage confidenceScore={confidenceScore} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StreamingBubbleCard;
