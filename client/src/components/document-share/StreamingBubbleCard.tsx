import {
  markdownComponents,
  remarkGfm,
} from "@/components/ui/markdownComponents";
import { Sparkles, TrendingUp } from "lucide-react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { StreamingBubble } from "./hooks/useMessageStream";

interface StreamingBubbleProps {
  streamingBubble: StreamingBubble;
  content: string;
  confidence: number;
}

function StreamingBubbleCard({
  streamingBubble,
  confidence,
}: StreamingBubbleProps) {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="max-w-[85%] bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
        <div className="text-[13px] leading-[1.7] font-sans text-text/80">
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
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {streamingBubble.content}
              </ReactMarkdown>

              {/* Confidence indicator during streaming */}
              {confidence > 0 && (
                <div className="mt-2 pt-2 border-t border-white/8 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-primary/70 animate-pulse" />
                  <span className="text-[9px] text-text/40 font-sans tracking-wider">
                    CONFIDENCE: {Math.round(confidence * 100)}%
                  </span>
                </div>
              )}

              <span className="inline-block w-0.5 h-3 bg-primary/70 animate-pulse align-middle ml-0.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StreamingBubbleCard;
