import useAuth from "@/features/auth/useAuth";
import useDocumentShare from "@/features/document-share/useDocumentShare";
import useMousePosition from "@/features/ui/useMousePostion";
import { useMemo } from "react";

const useDocumentPrivatePage = (documentId: string) => {
  const { getDocumentShareById } = useDocumentShare("");
  const {
    data: documentShare,
    isLoading: isDocumentShareLoading,
    refetch: refetchDocumentShare,
    isError: isDocumentShareError,
    error: documentShareError,
  } = getDocumentShareById(documentId);

  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
    refetch: refetchUser,
  } = me;

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
  };
};

export default useDocumentPrivatePage;
