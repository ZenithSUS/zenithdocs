import useDocumentShare from "@/features/document-share/useDocumentShare";
import { useDocumentShareByToken } from "@/features/document-share/useDocumentShareByToken";
import useMousePosition from "@/features/ui/useMousePostion";
import useRetryStore from "@/store/useRetryStore";
import { useMemo, useState } from "react";

type ActiveTab = "viewer" | "chat";

const useDocumentPublicPage = (shareToken: string) => {
  const { retries, increment } = useRetryStore();
  const pageRetries = retries["document-public"] ?? 0;

  const [activeTab, setActiveTab] = useState<ActiveTab>("viewer");

  const {
    data: documentShare,
    isLoading: isDocumentShareLoading,
    refetch: documentShareRefetch,
    isError: isDocumentShareError,
    error: documentShareError,
  } = useDocumentShareByToken(shareToken);

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

    // Tabs
    activeTab,
    setActiveTab,

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
