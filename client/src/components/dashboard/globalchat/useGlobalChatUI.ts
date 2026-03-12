import useGlobalChat from "@/features/global-chat/useGlobalChat";
import useGlobalMessage from "@/features/global-message/useGlobalMessage";
import useAutoResizeTextarea from "@/features/ui/useAutoResizeArea";
import { useMemo } from "react";
import useGlobalMessageStream from "./hooks/useGlobalMessageStream";

const useGlobalChatUI = (userId: string) => {
  const { initGlobalChat } = useGlobalChat(userId);
  const {
    data: initChat,
    isLoading: initChatLoading,
    isError: initChatError,
    error: initChatErrorData,
  } = initGlobalChat;
  const chatId = initChat?._id ?? "";

  const { globalMessagesByChatPage, deleteGlobalMessageMutation } =
    useGlobalMessage(chatId);
  const {
    data: globalMessages,
    isLoading: globalMessagesLoading,
    isError: globalMessagesError,
    error: globalMessagesErrorData,
    hasNextPage: hasNextGlobalMessagePage,
    fetchNextPage: fetchNextGlobalMessagePage,
  } = globalMessagesByChatPage;

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
