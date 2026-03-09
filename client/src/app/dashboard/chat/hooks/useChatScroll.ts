import { useRef, useEffect } from "react";
import { Message } from "@/types/message";

interface StreamingBubble {
  content: string;
}

const useChatScroll = (
  allMessages: Message[],
  streamingBubble: StreamingBubble | null,
) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastBottomMsgIdRef = useRef<string | null>(null);

  // Scroll when a new message is appended to the bottom
  useEffect(() => {
    if (allMessages.length === 0) return;
    const bottomId = allMessages[allMessages.length - 1]._id;
    if (bottomId !== lastBottomMsgIdRef.current) {
      lastBottomMsgIdRef.current = bottomId ?? null;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  // Scroll as streaming content grows
  useEffect(() => {
    if (streamingBubble) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingBubble?.content]);

  return messagesEndRef;
};

export default useChatScroll;
