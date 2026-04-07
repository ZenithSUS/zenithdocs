"use client";

import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";
import Header from "../../../components/dashboard/Header";
import LearningSetConfig from "./components/LearningSetConfig";
import useLearningSetsPage from "./useLearningSetsPage";
import GeneratedLearningSets from "./components/GeneratedLearningSets";
import CursorGlow from "@/components/CursorGlow";
import GlobalChatUI from "@/components/dashboard/GlobalChatUI";

function LearningSetsPage() {
  const {
    // UI
    mousePos,
    chatBotOpen,
    setChatBotOpen,

    // Retry
    pageRetry,
    retryLearningSetsPage,

    // Auth
    user,
    userLoading,

    // Documents
    documents,
    documentsLoading,
    documentsHasNextPage,
    fetchNextDocumentsPage,
    isFetchingNextDocumentsPage,

    // Learning Sets
    createLearningSetMutation,
    generatedSet,
    setGeneratedSet,

    // Errors
    isLearningSetPageError,
    learningSetPageErrorData,
  } = useLearningSetsPage();

  if (userLoading || documentsLoading) return <LoadingScreen />;

  if (isLearningSetPageError) {
    return (
      <ErrorScreen
        error={learningSetPageErrorData}
        onRetry={retryLearningSetsPage}
        messageErrorTitle="Learning Sets Load Error"
        retries={pageRetry}
      />
    );
  }

  return (
    <div className="h-screen bg-background text-text font-serif flex flex-col">
      {/* Ambient cursor glow */}
      <CursorGlow mousePos={mousePos} />

      {/* Global ChatBot */}
      <GlobalChatUI
        user={user ?? null}
        chatBotOpen={chatBotOpen}
        setChatBotOpen={setChatBotOpen}
      />

      <Header user={user} title="Document" titleHighlight="Study" />

      <main className="mt-18.25 h-[calc(100vh-73px)] overflow-y-auto px-5 sm:px-8 md:px-12 pt-10 pb-16">
        {!generatedSet ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-text/90 tracking-tight">
                Create a Learning Set
              </h1>
              <p className="text-sm text-text/45 mt-1">
                Pick a document, configure your preferences, and let AI do the
                rest.
              </p>
            </div>
            <LearningSetConfig
              userId={user?._id ?? ""}
              documents={documents}
              documentsHasNextPage={documentsHasNextPage}
              fetchNextDocumentsPage={fetchNextDocumentsPage}
              isFetchingNextDocumentsPage={isFetchingNextDocumentsPage}
              createLearningSetMutation={createLearningSetMutation}
              setGeneratedSet={setGeneratedSet}
            />
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-text/90 tracking-tight">
              Your Learning Set
            </h2>
            <GeneratedLearningSets
              learningSet={generatedSet}
              setLearningSet={setGeneratedSet}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default LearningSetsPage;
