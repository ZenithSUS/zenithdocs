import { useRef, useEffect } from "react";
import { Message } from "@/types/chat";

interface StreamingBubble {
  content: string;
}

const useChatScroll = (
  allMessages: Message[],
  streamingBubble: StreamingBubble | null,
) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastBottomMsgIdRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastMsgId = allMessages[allMessages.length - 1]?._id;

  // Scroll only when a genuinely new message appears at the bottom
  useEffect(() => {
    if (!lastMsgId) return;
    if (lastMsgId !== lastBottomMsgIdRef.current) {
      lastBottomMsgIdRef.current = lastMsgId;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastMsgId]);

  // Scroll as streaming content grows
  useEffect(() => {
    if (!streamingBubble) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [streamingBubble?.content]);

  return messagesEndRef;
};

export default useChatScroll;
