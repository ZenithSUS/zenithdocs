import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import useMessage from "@/features/message/useMessage";
import useMessageStream from "@/components/document-private/hooks/useMessageStream";
import useChatScroll from "./useChatScroll";
import useAutoResizeTextarea from "@/features/ui/useAutoResizeArea";

interface usePrivateChatScreenProps {
  documentId: string;
  chatId: string;
  userId: string;
}

const usePrivateChatScreen = ({
  documentId,
  chatId,
  userId,
}: usePrivateChatScreenProps) => {
  const { messagesByChatPage } = useMessage({ chatId });
  const {
    data: messages,
    isLoading: messagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = messagesByChatPage;

  const allMessages = useMemo(
    () =>
      messages?.pages
        .slice()
        .reverse()
        .flatMap((page) => page.messages) ?? [],
    [messages],
  );

  const stream = useMessageStream({
    docId: documentId,
    chatId,
    userId,
  });

  const textareaRef = useAutoResizeTextarea(stream.messageValue);
  const messagesEndRef = useChatScroll(allMessages, stream.streamingBubble);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    // Form
    ...stream,

    // Messages
    allMessages,
    messagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,

    // Refs
    messagesEndRef,
    textareaRef,

    // Handlers
    handleLoadMore,
  };
};

export default usePrivateChatScreen;
