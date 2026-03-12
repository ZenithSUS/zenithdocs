"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Sparkles,
  FileText,
  ArrowLeft,
  ChevronUp,
  MoreHorizontal,
  Zap,
} from "lucide-react";

import CursorGlow from "@/components/CursorGlow";
import ErrorScreen from "@/components/dashboard/ErrorScreen";
import DeleteMessagesModal from "@/components/dashboard/modals/chat/DeleteMessagesModal";
import useChatPage from "./useChatPage";
import {
  markdownComponents,
  remarkGfm,
} from "@/components/ui/markdownComponents";
import rehypeRaw from "rehype-raw";
import GlobalChat from "@/components/dashboard/globalchat";

// ─── Loading fallback (shared between Suspense boundary + internal states) ───
const FullPageSpinner = ({
  label = "Loading conversation...",
}: {
  label?: string;
}) => (
  <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[13px] text-text/50 font-sans">{label}</p>
    </div>
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────
function DocumentChatContent() {
  const router = useRouter();
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
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] text-text/70 font-serif mb-4">
            Document not found
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-primary text-background text-[12px] font-bold tracking-wider font-sans rounded-sm hover:bg-[#e0b530] transition-colors"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </div>
    );
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
      <header className="relative z-50 border-b border-white/8 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-2">
          <button
            onClick={() => router.push(`/dashboard/document/${docId}`)}
            className="flex items-center gap-2 text-text/50 hover:text-text/90 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[12px] font-sans tracking-wider hidden sm:inline">
              BACK
            </span>
          </button>

          <div className="flex items-center gap-3 flex-1 justify-center max-w-md min-w-0">
            <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 text-center">
              <h1 className="text-[14px] font-serif text-text/90 truncate">
                {documentData.title}
              </h1>
              <p className="text-[10px] text-text/40 font-sans tracking-wider">
                DOCUMENT CHAT
              </p>
            </div>
          </div>

          <div className="relative" ref={options.ref}>
            <button
              onClick={() => options.setIsOpen(!options.isOpen)}
              className="p-2 rounded-lg text-text/50 hover:text-text/90 hover:bg-white/8 transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {options.isOpen && (
              <div className="absolute top-full right-0 mt-2 min-w-45 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1.5 overflow-hidden">
                <div className="px-3 py-1.5 mb-1">
                  <span className="text-[10px] text-text/30 font-sans tracking-widest uppercase">
                    Options
                  </span>
                </div>
                <div className="h-px bg-white/8 mb-1" />
                <DeleteMessagesModal
                  chatId={initChat?._id ?? ""}
                  documentId={docId}
                  onAction={() => options.setIsOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          {/* Skeleton */}
          {isLoadingMessages && (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  {i % 2 !== 0 && (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 shrink-0 mt-1 animate-pulse" />
                  )}
                  <div
                    className={`h-14 rounded-2xl animate-pulse ${i % 2 === 0 ? "bg-primary/5 border border-primary/10" : "bg-white/5 border border-white/10"}`}
                    style={{ width: `${45 + (i % 3) * 15}%` }}
                  />
                  {i % 2 === 0 && (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 shrink-0 mt-1 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoadingMessages &&
            allMessages.length === 0 &&
            !streamingBubble && (
              <div className="flex flex-col items-center justify-center min-h-100 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-[24px] font-serif text-text/80 mb-3">
                  Start a Conversation
                </h2>
                <p className="text-[14px] text-text/40 font-sans max-w-md leading-relaxed mb-8">
                  Ask questions about{" "}
                  <span className="text-text/60 font-medium">
                    {documentData.title}
                  </span>
                  . I'll help you understand and extract insights from the
                  document.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {[
                    "Summarize the main points",
                    "What are the key takeaways?",
                    "Explain the technical details",
                    "What problems does this address?",
                    "What is the overall impact?",
                    "What are the challenges?",
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setValue("message", suggestion)}
                      className="group p-4 bg-white/5 border border-white/10 rounded-lg text-left hover:border-primary/30 hover:bg-white/8 transition-all duration-200"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                        <span className="text-[13px] text-text/60 font-sans group-hover:text-text/80 transition-colors">
                          {suggestion}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Message list */}
          {!isLoadingMessages &&
            (allMessages.length > 0 || streamingBubble) && (
              <div className="space-y-8">
                {hasNextPage && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className="flex items-center gap-2 px-4 py-2 text-[12px] font-sans tracking-wider text-text/50 hover:text-text/80 border border-white/10 hover:border-white/20 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <div className="w-3 h-3 border border-text/30 border-t-transparent rounded-full animate-spin" />
                          LOADING...
                        </>
                      ) : (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          LOAD EARLIER MESSAGES
                        </>
                      )}
                    </button>
                  </div>
                )}

                {allMessages.map((msg, idx) => (
                  <div
                    key={`message-${msg._id}-${idx}`}
                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                        msg.role === "user"
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div
                        className={`text-[14px] leading-[1.8] font-sans ${msg.role === "user" ? "text-text/90" : "text-text/80"}`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                              components={markdownComponents}
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                      <div className="text-[10px] text-text/30 font-sans mt-2 tracking-wider">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[12px] text-text/70 font-sans font-medium">
                          {user?.email[0].toUpperCase() ?? "?"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Streaming bubble */}
                {streamingBubble && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="max-w-[85%] sm:max-w-[75%] bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                      <div className="text-[14px] leading-[1.8] font-sans text-text/80">
                        {!streamingBubble.content ? (
                          <div className="flex gap-1.5 py-1">
                            {[0, 150, 300].map((delay) => (
                              <div
                                key={delay}
                                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                                style={{ animationDelay: `${delay}ms` }}
                              />
                            ))}
                          </div>
                        ) : (
                          <ReactMarkdown
                            components={markdownComponents}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {streamingBubble.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
        </div>
      </main>

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/8 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4">
          <div className="relative">
            <textarea
              {...register("message")}
              ref={(e) => {
                register("message").ref(e);
                (
                  textareaRef as React.RefObject<HTMLTextAreaElement | null>
                ).current = e;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about this document..."
              disabled={isTyping}
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-[14px] text-text/90 font-sans placeholder:text-text/30 outline-none focus:border-primary/30 focus:bg-white/8 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: "56px", maxHeight: "200px" }}
            />
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!messageValue.trim() || isTyping}
              className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center hover:bg-[#e0b530] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-text/25 font-sans text-center mt-3 tracking-wider">
            AI responses may contain errors. Verify important information.
          </p>
        </div>
      </footer>

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
