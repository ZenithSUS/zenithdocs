"use client";

import DocumentPublicHeader from "@/components/document-public/DocumentPublicHeader";
import { useParams } from "next/navigation";
import useDocumentPublicPage from "./useDocumentPublicPage";
import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";

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
  } = useDocumentPublicPage(token);

  if (isDocumentShareLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-5">
      <CursorGlow mousePos={mousePos} />

      <DocumentPublicHeader
        title={documentInfo?.title ?? "Untitled"}
        fileSize={documentInfo?.fileSize ?? 0}
        fileType={documentInfo?.fileType ?? "N/A"}
      />
    </div>
  );
}

export default DocumentPublicPage;
