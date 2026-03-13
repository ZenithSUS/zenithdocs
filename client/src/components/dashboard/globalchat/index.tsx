import React, { useEffect, useRef } from "react";

import { User } from "@/types/user";

import useGlobalChatUI from "./useGlobalChatUI";

import GlobalMessageCard from "./components/GlobalMessageCard";
import GlobalChatLoading from "./components/GlobalChatLoading";
import GlobalInputArea from "./components/GlobalMessageInputArea";
import LoadMoreGlobalMessageButton from "./components/LoadMoreGlobalMessageButton";
import EmptyStateGlobalMessage from "./components/EmptyStateGlobalMessage";
import StreamingBubbleCard from "./components/StreamingBubbleCard";
import GlobalMessageWrapper from "./components/GlobalMessageWrapper";
import GlobalChatHeader from "./components/GlobalChatHeader";
import GlobalErrorMessage from "./components/GlobalErrorMessage";

interface GlobalChatProps {
  user: User | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function GlobalChat({ user, setIsOpen }: GlobalChatProps) {
  const {
    chatId,
    allGlobalMessages,
    isProcessing,
    isError,
    handleSubmit,
    handleKeyDown,
    onSubmit,
    register,
    textareaRef,
    messageValue,
    setValue,
    streamingBubble,
    isTyping,
    hasNextGlobalMessagePage,
    fetchNextGlobalMessagePage,
    confidence,
  } = useGlobalChatUI(user?._id ?? "");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);

  const hasMessages = allGlobalMessages.length > 0;
  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";
  const showMessages = hasMessages || !!streamingBubble;

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasNextGlobalMessagePage) return;
    // Remember scroll position before loading so we don't jump to top
    const container = scrollContainerRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;

    setIsFetchingMore(true);
    try {
      await fetchNextGlobalMessagePage();
      // Restore scroll position after new messages prepend
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight;
      }
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allGlobalMessages]);

  if (isProcessing) {
    return <GlobalChatLoading />;
  }

  return (
    <div
      className="gc-container relative flex flex-col bg-[#0d0d0f] overflow-hidden
          sm:h-[58vh] sm:w-[32vw] sm:min-w-85 sm:max-w-120 sm:rounded-2xl"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow:
          "0 0 80px rgba(201,162,39,0.05), 0 30px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Top ambient glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C9A227, transparent)",
          opacity: 0.5,
        }}
      />

      {/* ── Header ── */}
      <GlobalChatHeader
        setIsOpen={setIsOpen}
        isTyping={isTyping}
        isProcessing={isProcessing}
        chatId={chatId}
      />

      {/* Divider */}
      <div
        className="h-px mx-4 mb-2 shrink-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />

      {/* ── Messages Area ── */}
      <div
        ref={scrollContainerRef}
        className="gc-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2 space-y-3 min-h-0"
      >
        {showMessages ? (
          <>
            {/* ── Load more button — top of message list ── */}
            {hasNextGlobalMessagePage && (
              <LoadMoreGlobalMessageButton
                isFetchingMore={isFetchingMore}
                handleLoadMore={handleLoadMore}
              />
            )}

            {/* Settled messages */}
            {allGlobalMessages.map((msg, idx) => {
              return (
                <GlobalMessageWrapper
                  key={msg._id ?? idx}
                  idx={idx}
                  message={msg}
                  userInitial={userInitial}
                  messageSize={allGlobalMessages.length}
                  streamingBubble={streamingBubble}
                >
                  <GlobalMessageCard globalMessage={msg} />
                </GlobalMessageWrapper>
              );
            })}

            {/* Streaming bubble */}
            {streamingBubble && (
              <StreamingBubbleCard
                streamingBubble={streamingBubble}
                confidenceScore={confidence}
              />
            )}

            <div ref={messagesEndRef} />
          </>
        ) : (
          /* Empty state */
          <EmptyStateGlobalMessage setValue={setValue} />
        )}

        {isError && <GlobalErrorMessage />}
      </div>

      {/* ── Input Area ── */}
      <GlobalInputArea
        register={register}
        textareaRef={textareaRef}
        messageValue={messageValue}
        streamingBubble={streamingBubble}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
      />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.8; }
          50%       { opacity: 0.3; }
        }
        @keyframes gc-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        .gc-bounce { animation: gc-bounce 1s ease-in-out infinite; }
        .gc-scrollbar::-webkit-scrollbar { width: 4px; }
        .gc-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .gc-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(201,162,39,0.2);
          border-radius: 4px;
        }
        .gc-textarea::-webkit-scrollbar { width: 3px; }
        .gc-textarea::-webkit-scrollbar-thumb {
          background: rgba(201,162,39,0.15);
          border-radius: 3px;
        }
        .send-btn:not(:disabled):hover .send-icon { transform: translateX(2px); }
        .send-icon { transition: transform 0.15s ease; }

        @media (max-width: 640px) {
          .gc-container {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
            z-index: 100;
          }
        }
      `}</style>
    </div>
  );
}

export default GlobalChat;
