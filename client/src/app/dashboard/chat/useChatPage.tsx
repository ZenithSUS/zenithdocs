"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import useAuth from "@/features/auth/useAuth";
import useChat from "@/features/chat/useChat";
import useDocument from "@/features/documents/useDocument";
import useMessage from "@/features/message/useMessage";

import useMousePosition from "@/app/dashboard/chat/hooks/useMousePostion";
import useDropdown from "@/app/dashboard/chat/hooks/useDropdown";
import useAutoResizeTextarea from "@/app/dashboard/chat/hooks/useAutoResizeArea";
import useChatScroll from "@/app/dashboard/chat/hooks/useChatScroll";
import useMessageStream from "@/app/dashboard/chat/hooks/useMessageStream";

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

  const isChatsProcessing = useMemo(
    () => initChatLoading || docLoading,
    [initChatLoading, docLoading],
  );

  // ─── Messages (paginated) ─────────────────────────────────────────────────
  const { messagesByChatPage } = useMessage({ chatId });
  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = messagesByChatPage;

  const allMessages = useMemo(
    () =>
      messages?.pages
        .slice()
        .reverse()
        .flatMap((page) => page.messages) ?? [],
    [messages],
  );

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
