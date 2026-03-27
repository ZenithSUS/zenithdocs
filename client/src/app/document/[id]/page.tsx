"use client";

import DocumentShareHeader from "@/components/document-share/DocumentShareHeader";
import DocumentSharedViewer from "@/components/document-share/DocumentSharedViewerWrapper";
import DocumentPrivateChat from "@/components/document-share/DocumentPrivateChat";
import LoadingScreen from "@/components/LoadingScreen";
import CursorGlow from "@/components/CursorGlow";
import { useParams } from "next/navigation";
import useDocumentPrivatePage from "./useDocumentPrivatePage";
import { useState } from "react";
import GlobalChat from "@/components/dashboard/globalchat";
import { Zap, FileText, MessageSquare } from "lucide-react";
import ErrorScreen from "@/components/ErrorScreen";

type ActiveTab = "viewer" | "chat";

export default function DocumentPrivatePage() {
  const params = useParams();
  const shareId = params?.id as string;
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("viewer");

  const {
    // Mouse
    mousePos,

    // Document
    documentInfo,
    isDocumentShareLoading,
    isDocumentShareError,
    documentShareError,

    // User
    user,
    userLoading,
    userError,
    userErrorData,

    // Document share info
    chatId,
    documentId,
    isDownloadable,

    // Retry
    pageRetries,
    retryUser,
    retryPrivateShare,
  } = useDocumentPrivatePage(shareId);

  if (userError) {
    return (
      <ErrorScreen
        error={userErrorData}
        onRetry={retryUser}
        messageErrorTitle="User Error"
        retries={pageRetries}
      />
    );
  }

  if (isDocumentShareError) {
    return (
      <ErrorScreen
        error={documentShareError}
        onRetry={retryPrivateShare}
        messageErrorTitle="Document Share Error"
        retries={pageRetries}
      />
    );
  }

  if (isDocumentShareLoading || userLoading) {
    return <LoadingScreen />;
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
        fileType={documentInfo?.fileType ?? "N/A"}
        fileSize={documentInfo?.fileSize ?? 0}
        fileUrl={documentInfo?.fileUrl ?? ""}
        isDownloadable={isDownloadable}
        type="private"
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
          {/* GlobalChat FAB — top-right corner of the chat panel */}
          <div className="absolute top-3 right-3 z-50">
            {chatBotOpen ? (
              <GlobalChat user={user ?? null} setIsOpen={setChatBotOpen} />
            ) : (
              <button
                onClick={() => setChatBotOpen(true)}
                className="bg-background rounded-full p-2 border border-primary hover:bg-primary/10 hover:scale-105 transition-transform"
                title="Open AI Assistant"
              >
                <Zap size={18} strokeWidth={2} />
              </button>
            )}
          </div>

          <DocumentPrivateChat
            documentId={documentId}
            userId={user?._id || ""}
            email={user?.email || ""}
            chatId={chatId}
            documentTitle={documentInfo?.title ?? "Untitled"}
          />
        </div>
      </div>
    </div>
  );
}
