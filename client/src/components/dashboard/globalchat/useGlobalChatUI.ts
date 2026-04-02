import { useMemo } from "react";
import { useGlobalChatInit } from "@/features/global-chat/useGlobalChatInit";
import useGlobalMessage from "@/features/global-message/useGlobalMessage";
import useAutoResizeTextarea from "@/features/ui/useAutoResizeArea";
import useGlobalMessageStream from "./hooks/useGlobalMessageStream";
import { useGlobalMessageByChatPage } from "@/features/global-message/useGlobalMessageByChatPage";

const useGlobalChatUI = (userId: string) => {
  const {
    data: initChat,
    isLoading: initChatLoading,
    isError: initChatError,
    error: initChatErrorData,
  } = useGlobalChatInit(userId);

  const chatId = initChat?._id ?? "";

  const { deleteGlobalMessageMutation } = useGlobalMessage(chatId);
  const {
    data: globalMessages,
    isLoading: globalMessagesLoading,
    isError: globalMessagesError,
    error: globalMessagesErrorData,
    hasNextPage: hasNextGlobalMessagePage,
    fetchNextPage: fetchNextGlobalMessagePage,
  } = useGlobalMessageByChatPage(chatId);

  const stream = useGlobalMessageStream({ chatId, userId });
  const textareaRef = useAutoResizeTextarea(stream.messageValue);

  const allGlobalMessages = useMemo(
    () =>
      globalMessages?.pages.reverse().flatMap((page) => page.globalMessages) ??
      [],
    [globalMessages],
  );

  const isProcessing = useMemo(() => {
    return initChatLoading || globalMessagesLoading;
  }, [initChatLoading, globalMessagesLoading]);

  const isError = useMemo(() => {
    return initChatError || globalMessagesError;
  }, [initChatError, globalMessagesError]);

  const errorMessage = useMemo(() => {
    if (initChatErrorData) {
      return (
        initChatErrorData.response?.data?.message ?? "Something went wrong"
      );
    }

    if (globalMessagesErrorData) {
      return (
        globalMessagesErrorData.response?.data?.message ??
        "Something went wrong"
      );
    }

    return "Something went wrong";
  }, [initChatErrorData, globalMessagesErrorData]);

  return {
    chatId,
    allGlobalMessages,
    isProcessing,
    deleteGlobalMessageMutation,
    isError,
    errorMessage,
    textareaRef,
    hasNextGlobalMessagePage,
    fetchNextGlobalMessagePage,
    ...stream,
  };
};

export default useGlobalChatUI;
