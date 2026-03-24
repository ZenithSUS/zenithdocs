import useAuth from "@/features/auth/useAuth";
import useChat from "@/features/chat/useChat";
import useDocumentShare from "@/features/document-share/useDocumentShare";
import useMousePosition from "@/features/ui/useMousePostion";
import { useMemo } from "react";

const useDocumentPrivatePage = (shareId: string) => {
  const { getDocumentShareById } = useDocumentShare("");
  const {
    data: documentShare,
    isLoading: isDocumentShareLoading,
    refetch: refetchDocumentShare,
    isError: isDocumentShareError,
    error: documentShareError,
  } = getDocumentShareById(shareId);

  const documentId = documentShare?.documentId._id ?? "";

  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
    refetch: refetchUser,
  } = me;

  const { initChatDocument } = useChat(user?._id ?? "");
  const { data: initChat, isLoading: initChatLoading } =
    initChatDocument(documentId);

  const chatId = initChat?._id ?? "";

  const documentInfo = useMemo(
    () => documentShare?.documentId || null,
    [documentShare],
  );

  const mousePos = useMousePosition();

  return {
    // Mouse
    mousePos,

    // Document Share
    documentInfo,
    documentShare,
    isDocumentShareLoading,
    refetchDocumentShare,
    isDocumentShareError,
    documentShareError,

    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Chat
    chatId,
    initChatLoading,

    // Document
    documentId,
  };
};

export default useDocumentPrivatePage;
