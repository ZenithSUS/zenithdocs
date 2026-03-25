"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import useAuth from "@/features/auth/useAuth";
import useChat from "@/features/chat/useChat";
import useDocument from "@/features/documents/useDocument";
import useMessage from "@/features/message/useMessage";
import useMousePosition from "@/features/ui/useMousePostion";
import useAutoResizeTextarea from "@/features/ui/useAutoResizeArea";
import useDropdown from "@/features/ui/useDropdown";

import useChatScroll from "@/app/dashboard/chat/hooks/useChatScroll";
import useMessageStream from "@/app/dashboard/chat/hooks/useMessageStream";
import { Message } from "@/types/message";

const useChatPage = () => {
  // ─── Route params ────────────────────────────────────────────────────────────
  const searchParams = useSearchParams();
  const docId = searchParams.get("doc") ?? "";

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
    refetch: refetchUser,
  } = me;

  // ─── Document + chat metadata ─────────────────────────────────────────────
  const { documentById } = useDocument(user?._id ?? "", docId);
  const { data: documentData, isLoading: docLoading } = documentById;

  const { initChatDocument } = useChat(user?._id ?? "");
  const { data: initChat, isLoading: initChatLoading } =
    initChatDocument(docId);

  const chatId = initChat?._id ?? "";

  const isChatsProcessing = initChatLoading || docLoading;

  // ─── Messages (paginated) ─────────────────────────────────────────────────
  const { messagesByChatPage } = useMessage({ chatId });
  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = messagesByChatPage;

  const allMessages = useMemo(() => {
    if (!messages?.pages) return [];

    const result: Message[] = [];
    for (let i = messages.pages.length - 1; i >= 0; i--) {
      result.push(...messages.pages[i].messages);
    }
    return result;
  }, [messages?.pages.length, messages?.pages[0]]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ─── Message streaming + form ────────────────────────────────────────────
  const stream = useMessageStream({
    docId,
    chatId,
    userId: user?._id ?? "",
  });

  // ─── UI utilities ─────────────────────────────────────────────────────────
  const mousePos = useMousePosition();
  const options = useDropdown();
  const textareaRef = useAutoResizeTextarea(stream.messageValue);
  const messagesEndRef = useChatScroll(allMessages, stream.streamingBubble);

  return {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Document / chat metadata
    docId,
    chatId,
    initChat,
    documentData,
    isChatsProcessing,

    // Messages
    allMessages,
    isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,

    // Stream + form (spread from sub-hook)
    ...stream,

    // UI state
    mousePos,
    options, // { isOpen, setIsOpen, ref }

    // Refs
    textareaRef,
    messagesEndRef,
  };
};

export default useChatPage;
