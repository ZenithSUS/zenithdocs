"use client";

import { useRouter } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/dashboard/ErrorScreen";

import useUploadPage from "./useUploadPage";
import FolderSelect from "./components/FolderSelect";
import DropZone from "./components/DropZone";
import FileList from "./components/FileList";
import UploadActions from "./components/UploadActions";
import GlobalChat from "@/components/dashboard/globalchat";
import { Zap } from "lucide-react";
import { useState } from "react";

export default function UploadPage() {
  const router = useRouter();
  const [chatBotOpen, setChatBotOpen] = useState(false);

  const {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

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
  } = useUploadPage();

  // ─── Guards ───────────────────────────────────────────────────────────────

  if (userError)
    return <ErrorScreen error={userErrorData} onRetry={refetchUser} />;
  if (userLoading) return <LoadingScreen />;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-background text-text font-serif">
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
      <header className="fixed top-0 left-0 right-0 z-45 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#F5F5F5]/60 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-2 text-sm tracking-widest font-sans"
          >
            ← BACK
          </button>
          <div className="h-5 w-px bg-[#F5F5F5]/10" />
          <h1 className="text-lg font-bold tracking-[0.08em] font-serif">
            UPLOAD <span className="text-[#C9A227]">DOCUMENTS</span>
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="h-[calc(100vh-73px)] mt-18.25 flex-1 max-w-5xl overflow-y-auto pt-6 pb-12 px-5 sm:px-8 md:px-12 mx-auto">
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
