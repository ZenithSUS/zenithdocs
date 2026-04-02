import useAuth from "@/features/auth/useAuth";
import useChat from "@/features/chat/useChat";
import { useChatInitDocument } from "@/features/chat/useChatInitDocument";
import useDocumentShare from "@/features/document-share/useDocumentShare";
import { useDocumentShareById } from "@/features/document-share/useDocumentShareById";
import useMousePosition from "@/features/ui/useMousePostion";
import useRetryStore from "@/store/useRetryStore";
import { useMemo } from "react";

const useDocumentPrivatePage = (shareId: string) => {
  const { retries, increment } = useRetryStore();
  const pageRetries = retries["document-private"] ?? 0;

  const {
    data: documentShare,
    isLoading: isDocumentShareLoading,
    refetch: refetchDocumentShare,
    isError: isDocumentShareError,
    error: documentShareError,
  } = useDocumentShareById(shareId);

  const documentId = documentShare?.documentId._id ?? "";

  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
    refetch: refetchUser,
  } = me;

  const { data: initChat, isLoading: initChatLoading } = useChatInitDocument(
    user?._id ?? "",
    documentId,
  );

  const chatId = initChat?._id ?? "";

  const documentInfo = useMemo(
    () => documentShare?.documentId || null,
    [documentShare],
  );

  const isDownloadable = documentShare?.allowDownload ?? false;

  const mousePos = useMousePosition();

  const retryUser = () => {
    increment("document-private");
    refetchUser().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("document-private");
      }
    });
  };

  const retryPrivateShare = () => {
    increment("document-private");
    refetchDocumentShare().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("document-private");
      }
    });
  };

  return {
    // Mouse
    mousePos,

    // Document Share
    documentInfo,
    documentShare,
    isDocumentShareLoading,
    isDocumentShareError,
    documentShareError,

    // Auth
    user,
    userLoading,
    userError,
    userErrorData,

    // Chat
    chatId,
    initChatLoading,

    // Document
    documentId,
    isDownloadable,

    // Retry
    pageRetries,
    retryUser,
    retryPrivateShare,
  };
};

export default useDocumentPrivatePage;
