import useAutoResizeTextarea from "@/features/ui/useAutoResizeArea";
import useChatScroll from "@/features/ui/useChatScroll";
import { Message } from "@/types/chat";
import { useState } from "react";
import usePublicMessageStream from "./usePublicMessageStream";

const usePublicChatScreen = (shareToken: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const removeMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((m) => m._id !== messageId),
    );
  };

  const stream = usePublicMessageStream({
    shareToken,
    messages,
    addMessage,
    removeMessage,
  });

  const textAreaRef = useAutoResizeTextarea("");
  const messagesEndRef = useChatScroll(messages, null);

  return { ...stream, messages, textAreaRef, messagesEndRef };
};

export default usePublicChatScreen;
