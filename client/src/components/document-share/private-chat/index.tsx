"use client";

import { Message } from "@/types/message";

import MessageInputArea from "./MessageInputArea";
import StartingChatScreen from "./StartingChatScreen";
import DocumentChatHeader from "../DocumentChatHeader";
import usePrivateChatScreen from "../hooks/usePrivateChatScreen";
import StreamingBubbleCard from "./StreamingBubbleCard";
import { FourSquare } from "react-loading-indicators";
import MessageCard from "./MessageCard";
import LoadMoreMessageButton from "./LoadMoreMessageButton";
import MessageSkeleton from "@/components/skeleton/MessageSkeleton";
import { useMemo } from "react";

interface DocumentPrivateChatProps {
  documentId: string;
  userId: string;
  email: string;
  chatId: string;
  documentTitle: string;
}

export default function DocumentPrivateChat({
  documentId,
  userId,
  email,
  chatId,
  documentTitle,
}: DocumentPrivateChatProps) {
  const {
    // Message Form
    register,
    handleSubmit,
    setValue,
    messageValue,
    onSubmit,
    handleKeyDown,
    isTyping,
    streamingBubble,
    confidence,

    // Message States
    allMessages,
    messagesLoading,
    hasNextPage,
    isFetchingNextPage,

    // Message Refs
    messagesEndRef,
    textareaRef,

    // Message Actions
    handleLoadMore,
  } = usePrivateChatScreen({ documentId, chatId, userId });

  const messagesNodes = useMemo(
    () =>
      allMessages.map((msg: Message) => (
        <MessageCard key={msg._id} message={msg} email={email} />
      )),
    [allMessages, email],
  );

  if (!chatId) {
    return (
      <div className="h-full flex items-center justify-center flex-col">
        <FourSquare color="#c9a227" size="medium" />
        <h1 className="text-primary font-semibold tracking-wide">
          Loading chat...
        </h1>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header */}
      <DocumentChatHeader
        documentId={documentId}
        chatId={chatId}
        isTyping={isTyping}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messagesLoading ? (
          <MessageSkeleton />
        ) : allMessages.length === 0 && !isTyping ? (
          <StartingChatScreen
            setValue={setValue}
            documentTitle={documentTitle}
          />
        ) : (
          <div className="space-y-6">
            {/* Load more button */}
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
                content={streamingBubble.content}
                confidence={confidence}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
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
          50% { transform: translateY(-3px); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .prose { color: inherit; }
        .prose code { font-family: 'Courier New', monospace; }
      `}</style>
    </div>
  );
}
