"use client";

import { Suspense, useMemo, useState } from "react";
import { ChevronLeft, Sparkles, Zap } from "lucide-react";

import CursorGlow from "@/components/CursorGlow";
import ErrorScreen from "@/components/ErrorScreen";
import useChatPage from "./useChatPage";
import ChatHeader from "./components/ChatHeader";
import MessageSkeleton from "../../../components/skeleton/MessageSkeleton";
import EmptyStateMessage from "./components/EmptyStateMessage";
import MessageCard from "./components/MessageCard";
import StreamingBubbleCard from "./components/StreamBubbleCard";
import MessageInputArea from "./components/MessageInputArea";
import LoadMoreMessageButton from "./components/LoadMoreMessageButton";
import FullPageSpinner from "./components/FullPageSpinner";
import DocumentViewer from "./components/DocumentViewerWrapper";
import GlobalChatUI from "@/components/dashboard/GlobalChatUI";

function DocumentChatContent() {
  const {
    // Auth
    user,
    userError,
    userErrorData,

    // Document / chat metadata
    docId,
    initChat,
    documentData,
    isChatsProcessing,
    userLoading,
    isDocumentChatError,
    documentChatErrorData,

    // Retry
    pageRetries,
    retryUser,
    retryDocumentChat,

    // Messages
    allMessages,
    isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,

    // Stream + form
    register,
    handleSubmit,
    setValue,
    messageValue,
    isTyping,
    streamingBubble,
    onSubmit,
    handleKeyDown,

    // UI
    mousePos,
    options,
    chatBotOpen,
    setChatBotOpen,
    panelOpen,
    setPanelOpen,

    // Refs
    textareaRef,
    messagesEndRef,

    // States
    confidence,
  } = useChatPage();

  const messagesNodes = useMemo(
    () =>
      allMessages.map((msg) => (
        <div
          key={msg._id}
          className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          )}
          <MessageCard message={msg} />
          {msg.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-[12px] text-text/70 font-sans font-medium">
                {user?.email[0].toUpperCase() ?? "?"}
              </span>
            </div>
          )}
        </div>
      )),
    [allMessages, user?.email],
  );

  // ─── Guards ──────────────────────────────────────────────────────────────
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

  if (isDocumentChatError) {
    return (
      <ErrorScreen
        error={documentChatErrorData}
        onRetry={retryDocumentChat}
        messageErrorTitle="Document Chat Error"
        retries={pageRetries}
      />
    );
  }

  if (isChatsProcessing || userLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="h-screen bg-background text-text font-serif flex flex-col overflow-hidden relative">
      <CursorGlow mousePos={mousePos} />

      {/* Global chat UI */}
      <GlobalChatUI
        user={user ?? null}
        chatBotOpen={chatBotOpen}
        setChatBotOpen={setChatBotOpen}
      />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Document panel */}
      <div
        className={`
    fixed z-45 bg-background border-white/6 flex flex-col
    transition-all duration-300 ease-in-out
    inset-0
    ${panelOpen ? "h-screen" : "h-0 overflow-hidden"}
    lg:bottom-auto lg:right-auto lg:inset-y-0 lg:left-0 lg:border-t-0 lg:border-r lg:h-screen
    ${panelOpen ? "lg:w-1/2" : "lg:w-0 lg:overflow-hidden lg:border-r-0"}
  `}
      >
        <div className="px-4 py-3 border-b border-white/6 shrink-0 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs text-[#F5F5F5]/40 font-sans uppercase tracking-widest mb-0.5">
              Document
            </p>
            <h2 className="text-sm font-medium text-[#F5F5F5] truncate">
              {documentData?.title ?? "Untitled"}
            </h2>
          </div>
          {/* Close button visible on mobile */}
          <button
            onClick={() => setPanelOpen(false)}
            className="lg:hidden p-1.5 rounded hover:bg-white/10 text-[#F5F5F5]/50"
          >
            <ChevronLeft size={16} className="-rotate-90" />
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col overflow-auto">
          <DocumentViewer document={documentData ?? null} />
        </div>
      </div>

      {/* Toggle Tab button — hidden on mobile when panel is open (close button in header handles it) */}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className={`fixed top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ease-in-out
    bg-background border border-white/10 hover:bg-white/5
    rounded-r-lg px-1 py-4 flex flex-col items-center gap-1.5
    ${panelOpen ? "hidden lg:flex lg:left-1/2" : "left-0 flex"}`}
      >
        {/* Animated chevron */}
        <ChevronLeft
          size={14}
          className={`text-[#F5F5F5]/50 transition-transform duration-300 ${panelOpen ? "" : "rotate-180"}`}
        />
        {!panelOpen && (
          <span
            className="text-[10px] text-[#F5F5F5]/30 font-sans uppercase tracking-widest"
            style={{ writingMode: "vertical-rl" }}
          >
            Document
          </span>
        )}
      </button>

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 min-h-0 transition-all duration-300 ease-in-out ${
          panelOpen ? "lg:ml-[50%]" : "lg:ml-0"
        }`}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <ChatHeader
          docId={docId}
          chatId={initChat?._id ?? ""}
          documentData={documentData ?? null}
          options={options}
          isTyping={isTyping}
        />

        {/* ── Messages ───────────────────────────────────────────────────────── */}
        <main className="relative z-10 flex-1 overflow-y-auto min-h-0">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
            {/* Skeleton */}
            {isLoadingMessages && <MessageSkeleton />}

            {/* Empty state */}
            {!isLoadingMessages &&
              allMessages.length === 0 &&
              !streamingBubble && (
                <EmptyStateMessage
                  title={documentData?.title ?? "Untitled"}
                  setValue={setValue}
                />
              )}

            {/* Message list */}
            {!isLoadingMessages &&
              (allMessages.length > 0 || streamingBubble) && (
                <div className="space-y-8">
                  {hasNextPage && (
                    <LoadMoreMessageButton
                      isFetchingNextPage={isFetchingNextPage}
                      handleLoadMore={handleLoadMore}
                    />
                  )}

                  {messagesNodes}

                  {/* Streaming bubble */}
                  {streamingBubble && (
                    <StreamingBubbleCard
                      streamingBubble={streamingBubble}
                      confidenceScore={confidence}
                    />
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
          </div>
        </main>

        {/* ── Input ──────────────────────────────────────────────────────────── */}
        <MessageInputArea
          register={register}
          textareaRef={textareaRef}
          handleKeyDown={handleKeyDown}
          isTyping={isTyping}
          messageValue={messageValue}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
        />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce { animation: bounce 1s ease-in-out infinite; }
        .prose { color: inherit; }
        .prose code { font-family: 'Courier New', monospace; }
      `}</style>
    </div>
  );
}

// ─── Suspense wrapper ────────────────────────────────────────────────────────
export default function DocumentChatPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <DocumentChatContent />
    </Suspense>
  );
}
