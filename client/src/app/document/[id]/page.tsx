"use client";

import DocumentPrivateHeader from "@/components/document-private/DocumentPrivateHeader";
import DocumentSharedViewer from "@/components/document-private/DocumentSharedViewerWrapper";
import LoadingScreen from "@/components/LoadingScreen";
import CursorGlow from "@/components/CursorGlow";
import { useParams } from "next/navigation";
import useDocumentPrivatePage from "./useDocumentPrivatePage";
import { useState } from "react";
import GlobalChat from "@/components/dashboard/globalchat";
import { Zap } from "lucide-react";
import ErrorScreen from "@/components/ErrorScreen";

export default function DocumentPrivatePage() {
  const params = useParams();
  const documentId = params?.id as string;
  const [chatBotOpen, setChatBotOpen] = useState(false);

  const {
    mousePos,
    documentInfo,
    isDocumentShareLoading,
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,
  } = useDocumentPrivatePage(documentId);

  if (userError) {
    return <ErrorScreen error={userErrorData} onRetry={refetchUser} />;
  }

  if (isDocumentShareLoading || userLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen bg-background text-text font-serif flex flex-col overflow-hidden relative">
      <CursorGlow mousePos={mousePos} />

      {/* ChatBot */}
      {chatBotOpen ? (
        <div className="fixed bottom-5 right-5 z-50">
          <GlobalChat user={user ?? null} setIsOpen={setChatBotOpen} />
        </div>
      ) : (
        <div className="bg-background rounded-full p-2 border border-primary fixed bottom-5 right-5 z-50 hover:bg-primary/10 hover:scale-105 transition-transform">
          <Zap
            onClick={() => setChatBotOpen(true)}
            className="cursor-pointer hover:scale-105 transition-transform"
            size={20}
            strokeWidth={2}
          />
        </div>
      )}

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

      <DocumentPrivateHeader
        title={documentInfo?.title ?? "Untitled"}
        fileType={documentInfo?.fileType ?? "N/A"}
        fileSize={documentInfo?.fileSize ?? 0}
      />

      {/* Viewer fills remaining space */}
      <div className="relative flex-1 min-h-0 z-10">
        <DocumentSharedViewer document={documentInfo ?? null} />
      </div>
    </div>
  );
}
