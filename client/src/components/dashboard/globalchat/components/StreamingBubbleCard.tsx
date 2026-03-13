import {
  markdownComponents,
  remarkGfm,
} from "@/components/ui/markdownComponents";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { StreamingBubble } from "../hooks/useGlobalMessageStream";
import getConfidenceMessage from "@/utils/confidence-message";
import ConfidenceMessage from "./ConfidenceMessage";

interface StreamingBubbleProps {
  streamingBubble: StreamingBubble;
  confidenceScore: number;
}

function StreamingBubbleCard({
  streamingBubble,
  confidenceScore,
}: StreamingBubbleProps) {
  return (
    <div
      className="flex gap-2 justify-start min-w-0"
      style={{ animation: "fadeSlideIn 0.25s ease-out" }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
        style={{
          background: "rgba(201,162,39,0.1)",
          border: "1px solid rgba(201,162,39,0.2)",
        }}
      >
        <Sparkles
          size={11}
          style={{ color: "#C9A227" }}
          className={!streamingBubble.content ? "animate-pulse" : ""}
        />
      </div>

      <div
        className="relative min-w-0 overflow-hidden rounded-xl rounded-tl-sm px-3 py-2
                              text-[12px] leading-relaxed text-white/70 max-w-[80%]"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {!streamingBubble.content ? (
          <div className="flex gap-1.5 py-1">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="gc-bounce w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#C9A227",
                  opacity: 0.7,
                  animationDelay: `${delay}ms`,
                }}
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
  );
}

export default StreamingBubbleCard;
