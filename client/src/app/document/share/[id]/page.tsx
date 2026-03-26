"use client";

import DocumentShareHeader from "@/components/document-share/DocumentShareHeader";
import { useParams } from "next/navigation";
import useDocumentPublicPage from "./useDocumentPublicPage";
import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import DocumentSharedViewer from "@/components/document-share/DocumentSharedViewerWrapper";
import ErrorScreen from "@/components/ErrorScreen";
import DocumentPublicChat from "@/components/document-share/DocumentPublicChat";
import { FileText, MessageSquare } from "lucide-react";
import { useState } from "react";

type ActiveTab = "viewer" | "chat";

function DocumentPublicPage() {
  const params = useParams();
  const token = params?.id as string;
  const [activeTab, setActiveTab] = useState<ActiveTab>("viewer");

  const {
    // Mouse
    mousePos,

    // Document
    documentInfo,

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

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,162,39,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,162,39,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <DocumentShareHeader
        title={documentInfo?.title ?? "Untitled"}
        fileSize={documentInfo?.fileSize ?? 0}
        fileType={documentInfo?.fileType ?? "N/A"}
        fileUrl={documentInfo?.fileUrl ?? ""}
        isDownloadable={isDownloadable}
        type="public"
      />

      {/* Mobile/Tablet tab switcher — hidden on desktop */}
      <div className="lg:hidden relative z-10 flex border-b border-white/6 shrink-0">
        <button
          onClick={() => setActiveTab("viewer")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-sans tracking-wider transition-colors ${
            activeTab === "viewer"
              ? "text-primary border-b-2 border-primary"
              : "text-text/40 hover:text-text/70"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          DOCUMENT
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-sans tracking-wider transition-colors ${
            activeTab === "chat"
              ? "text-primary border-b-2 border-primary"
              : "text-text/40 hover:text-text/70"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          CHAT
        </button>
      </div>

      {/* Split screen: side-by-side on desktop, tabbed on mobile/tablet */}
      <div className="relative flex-1 min-h-0 z-10 flex flex-col lg:flex-row">
        {/* Left: Document Viewer */}
        <div
          className={`lg:w-1/2 lg:border-r border-white/8 flex-1 min-h-0 ${
            activeTab === "viewer" ? "flex flex-col" : "hidden"
          } lg:flex lg:flex-col`}
        >
          <DocumentSharedViewer document={documentInfo ?? null} />
        </div>

        {/* Right: Chat panel */}
        <div
          className={`lg:w-1/2 flex-1 min-h-0 relative ${
            activeTab === "chat" ? "flex flex-col" : "hidden"
          } lg:flex lg:flex-col`}
        >
          <DocumentPublicChat
            shareToken={token}
            documentTitle={documentInfo?.title ?? "Untitled"}
          />
        </div>
      </div>
    </div>
  );
}

export default DocumentPublicPage;
