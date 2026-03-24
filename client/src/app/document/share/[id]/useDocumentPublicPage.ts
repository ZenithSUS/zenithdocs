import useDocumentShare from "@/features/document-share/useDocumentShare";
import useMousePosition from "@/features/ui/useMousePostion";
import { useMemo } from "react";

const useDocumentPublicPage = (shareToken: string) => {
  const { getDocumentSharedByToken } = useDocumentShare("");
  const {
    data: documentShare,
    isLoading: isDocumentShareLoading,
    refetch: documentShareRefetch,
    isError: isDocumentShareError,
    error: documentShareError,
  } = getDocumentSharedByToken(shareToken);

  const documentInfo = useMemo(
    () => documentShare?.documentId || null,
    [documentShare],
  );

  const mousePos = useMousePosition();

  return {
    // Mouse
    mousePos,

    // Document
    documentInfo,
    documentShare,
    isDocumentShareLoading,
    documentShareRefetch,
    isDocumentShareError,
    documentShareError,
  };
};

export default useDocumentPublicPage;
