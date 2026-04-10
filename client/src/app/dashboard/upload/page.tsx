"use client";

import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";

import useUploadPage from "./useUploadPage";
import FolderSelect from "./components/FolderSelect";
import DropZone from "./components/DropZone";
import FileList from "./components/FileList";
import UploadActions from "./components/UploadActions";
import Header from "@/components/dashboard/Header";
import GlobalChatUI from "@/components/dashboard/GlobalChatUI";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
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
    chatBotOpen,
    setChatBotOpen,

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
    anyFileSuccess,

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

      {/* Global Chat UI */}
      <GlobalChatUI
        user={user ?? null}
        chatBotOpen={chatBotOpen}
        setChatBotOpen={setChatBotOpen}
      />

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

        {anyFileSuccess && (
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 w-full text-[11px] tracking-[0.15em] text-[#C9A227] hover:text-[#F5F5F5] transition-colors font-sans"
          >
            GO TO DASHBOARD →
          </button>
        )}
      </main>

      <style>{`
        select option { background: #1f2937; color: #f5f5f5; }
      `}</style>
    </div>
  );
}
