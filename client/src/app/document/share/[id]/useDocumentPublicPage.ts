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

  const isDownloadable = documentShare?.allowDownload ?? false;

  const mousePos = useMousePosition();

  return {
    // Mouse
    mousePos,

    // Document
    documentInfo,
    isDocumentShareLoading,
    documentShareRefetch,
    isDocumentShareError,
    documentShareError,
    isDownloadable,
  };
};

export default useDocumentPublicPage;
