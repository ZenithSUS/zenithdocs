"use client";

import { Suspense, useState } from "react";
import { Zap } from "lucide-react";

import CursorGlow from "@/components/CursorGlow";
import ErrorScreen from "@/components/dashboard/ErrorScreen";
import useChatPage from "./useChatPage";
import GlobalChat from "@/components/dashboard/globalchat";
import ChatHeader from "./components/ChatHeader";
import MessageSkeleton from "./components/MessageSkeleton";
import EmptyStateMessage from "./components/EmptyStateMessage";
import MessageCard from "./components/MessageCard";
import StreamingBubbleCard from "./components/StreamBubbleCard";
import MessageInputArea from "./components/MessageInputArea";
import LoadMoreMessageButton from "./components/LoadMoreMessageButton";
import FullPageSpinner from "./components/FullPageSpinner";
import ChatNotFound from "./components/ChatNotFound";

function DocumentChatContent() {
  const [chatBotOpen, setChatBotOpen] = useState(false);

  const {
    // Auth
    user,
    userError,
    userErrorData,
    refetchUser,

    // Document / chat metadata
    docId,
    initChat,
    documentData,
    isChatsProcessing,
    userLoading,

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

    // Refs
    textareaRef,
    messagesEndRef,
  } = useChatPage();

  // ─── Guards ──────────────────────────────────────────────────────────────
  if (userError) {
    return <ErrorScreen error={userErrorData} onRetry={refetchUser} />;
  }

  if (isChatsProcessing || userLoading) {
    return <FullPageSpinner />;
  }

  if (!documentData || !docId) {
    return <ChatNotFound />;
  }

  return (
    <div className="h-screen bg-[#111111] text-[#F5F5F5] font-serif flex flex-col overflow-hidden relative">
      <CursorGlow mousePos={mousePos} />

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

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <ChatHeader
        docId={docId}
        chatId={initChat?._id ?? ""}
        documentData={documentData}
        options={options}
      />

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          {/* Skeleton */}
          {isLoadingMessages && <MessageSkeleton />}

          {/* Empty state */}
          {!isLoadingMessages &&
            allMessages.length === 0 &&
            !streamingBubble && (
              <EmptyStateMessage
                title={documentData.title}
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

                {allMessages.map((msg, idx) => (
                  <MessageCard
                    message={msg}
                    index={idx}
                    email={user?.email ?? "?"}
                  />
                ))}

                {/* Streaming bubble */}
                {streamingBubble && (
                  <StreamingBubbleCard streamingBubble={streamingBubble} />
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
