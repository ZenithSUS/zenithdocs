"use client";

import { useRouter } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";

import useUploadPage from "./useUploadPage";
import FolderSelect from "./components/FolderSelect";
import DropZone from "./components/DropZone";
import FileList from "./components/FileList";
import UploadActions from "./components/UploadActions";
import GlobalChat from "@/components/dashboard/globalchat";
import { Zap } from "lucide-react";
import { useState } from "react";
import Header from "@/components/dashboard/Header";

export default function UploadPage() {
  const router = useRouter();
  const [chatBotOpen, setChatBotOpen] = useState(false);

  const {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,

    // UI
    mousePos,
    isDragging,
    fileInputRef,

    // Folders
    allFolders,
    selectedFolder,
    setSelectedFolder,

    // Files
    files,
    setFiles,
    removeFile,
    hasValidFiles,
    hasUploadingFiles,

    // Drop handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,

    // Upload
    uploadFiles,

    // Retries
    pageRetries,
    retryUser,
  } = useUploadPage();

  // ─── Guards ───────────────────────────────────────────────────────────────

  if (userError)
    return (
      <ErrorScreen
        error={userErrorData}
        onRetry={retryUser}
        messageErrorTitle="Upload Error"
        retries={pageRetries}
      />
    );
  if (userLoading) return <LoadingScreen />;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-background overflow-hidden text-text font-serif">
      <CursorGlow mousePos={mousePos} />

      {/* Chatbot button */}
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

      {/* Header */}
      <Header user={user} title="Upload" titleHighlight="Files" />

      {/* Main */}
      <main className="h-[calc(100vh-73px)] mt-18.25 flex-1 overflow-y-auto pt-6 pb-12 px-5 sm:px-8 md:px-12 mx-auto">
        <FolderSelect
          folders={allFolders}
          value={selectedFolder}
          onChange={setSelectedFolder}
        />

        <DropZone
          isDragging={isDragging}
          fileInputRef={fileInputRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
        />

        <FileList
          files={files}
          onRemove={removeFile}
          onClear={() => setFiles([])}
        />

        {files.length > 0 && (
          <UploadActions
            hasValidFiles={hasValidFiles}
            hasUploadingFiles={hasUploadingFiles}
            isReady={!!user}
            onUpload={uploadFiles}
          />
        )}
      </main>

      <style>{`
        select option { background: #1f2937; color: #f5f5f5; }
      `}</style>
    </div>
  );
}
