"use client";

import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";

import useDocumentPage from "./useDocumentPage";
import DocumentInfo from "./components/DocumentInfo";
import DocumentTabs from "./components/DocumentTabs";
import DocumentDetailsTab from "./components/DocumentDetailsTab";
import DocumentSummariesTab from "./components/DocumentSummariesTab";
import GlobalChatUI from "@/components/dashboard/GlobalChatUI";
import DocumentHeader from "./components/DoocumentHeader";
import DocumentNotFound from "./components/DocumentNotFound";

export default function DocumentViewPage() {
  const {
    // IDs
    documentId,
    userId,

    // Auth
    user,
    userError,
    userErrorData,

    // Document
    document,
    folder,
    statusMeta,
    isDocumentLoading,
    isDocumentError,
    documentErrorData,

    // Retries
    pageRetries,
    retryUser,
    retryDoc,

    // Summaries
    documentSummaries,
    paginatedSummaries,
    totalPages,

    // Pagination
    currentPage,
    setCurrentPage,

    // Tabs
    activeTab,
    setActiveTab,

    // UI
    mousePos,
    chatBotOpen,
    setChatBotOpen,
  } = useDocumentPage();

  // ─── Guards ───────────────────────────────────────────────────────────────

  if (userError)
    return (
      <ErrorScreen
        error={userErrorData}
        onRetry={retryUser}
        messageErrorTitle="User Error"
        retries={pageRetries}
      />
    );

  if (isDocumentError)
    return (
      <ErrorScreen
        error={documentErrorData}
        onRetry={retryDoc}
        messageErrorTitle="Document Error"
        retries={pageRetries}
      />
    );

  if (isDocumentLoading) return <LoadingScreen />;

  if (!document) {
    return <DocumentNotFound />;
  }

  return (
    <div className="h-screen bg-[#111111] text-[#F5F5F5] font-serif overflow-y-auto">
      <CursorGlow mousePos={mousePos} />

      {/* Global chat UI */}
      <GlobalChatUI
        user={user ?? null}
        chatBotOpen={chatBotOpen}
        setChatBotOpen={setChatBotOpen}
      />

      {/* Header */}
      <DocumentHeader documentId={documentId} />

      {/* Main */}
      <main className="pt-24 pb-12 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        <DocumentInfo
          documentId={documentId}
          document={document}
          folder={folder}
          statusMeta={statusMeta!}
        />

        <DocumentTabs
          active={activeTab}
          summaryCount={documentSummaries.length}
          onSelect={setActiveTab}
        />

        {activeTab === "details" && (
          <DocumentDetailsTab
            document={document}
            folder={folder}
            statusMeta={statusMeta!}
          />
        )}

        {activeTab === "summaries" && (
          <DocumentSummariesTab
            documentId={documentId}
            userId={userId}
            summaries={documentSummaries}
            paginatedSummaries={paginatedSummaries}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
