"use client";

import DocumentHeader from "@/components/document-share/DocumentHeader";
import { useParams } from "next/navigation";
import useDocumentPublicPage from "./useDocumentPublicPage";
import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import DocumentSharedViewer from "@/components/document-share/DocumentSharedViewerWrapper";
import ErrorScreen from "@/components/ErrorScreen";

function DocumentPublicPage() {
  const params = useParams();
  const token = params?.id as string;

  const {
    // Mouse
    mousePos,

    // Document
    documentInfo,
    documentShare,
    isDocumentShareLoading,
    documentShareRefetch,
    isDocumentShareError,
    documentShareError,
    isDownloadable,
  } = useDocumentPublicPage(token);

  if (isDocumentShareLoading) {
    return <LoadingScreen />;
  }

  if (isDocumentShareError) {
    return (
      <ErrorScreen error={documentShareError} onRetry={documentShareRefetch} />
    );
  }

  return (
    <div className="h-screen bg-background text-text font-serif flex flex-col overflow-hidden relative">
      <CursorGlow mousePos={mousePos} />

      <DocumentHeader
        title={documentInfo?.title ?? "Untitled"}
        fileSize={documentInfo?.fileSize ?? 0}
        fileType={documentInfo?.fileType ?? "N/A"}
        fileUrl={documentInfo?.fileUrl ?? ""}
        isDownloadable={isDownloadable}
      />

      <DocumentSharedViewer document={documentShare?.documentId ?? null} />
    </div>
  );
}

export default DocumentPublicPage;
