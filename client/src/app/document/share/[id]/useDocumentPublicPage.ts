import useDocumentShare from "@/features/document-share/useDocumentShare";
import useMousePosition from "@/features/ui/useMousePostion";
import useRetryStore from "@/store/useRetryStore";
import { useMemo } from "react";

const useDocumentPublicPage = (shareToken: string) => {
  const { retries, increment } = useRetryStore();
  const pageRetries = retries["document-public"] ?? 0;

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

  const retryPrivateShare = () => {
    increment("document-public");
    documentShareRefetch().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("document-public");
      }
    });
  };

  return {
    // Mouse
    mousePos,

    // Document
    documentInfo,
    isDocumentShareLoading,
    isDocumentShareError,
    documentShareError,
    isDownloadable,

    // Retry
    pageRetries,
    retryPrivateShare,
  };
};

export default useDocumentPublicPage;
