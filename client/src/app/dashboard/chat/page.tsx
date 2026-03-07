"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import CursorGlow from "@/components/CursorGlow";
import {
  Send,
  Sparkles,
  FileText,
  ArrowLeft,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import useChat from "@/features/chat/useChat";
import useDocument from "@/features/documents/useDocument";
import ReactMarkdown from "react-markdown";
import useAuth from "@/features/auth/useAuth";
import { toast } from "sonner";
import { Message } from "@/types/chat";
import DeleteMessagesModal from "@/components/dashboard/modals/chat/DeleteMessagesModal";

const PAGE_SIZE = 20;

interface MessageFormValues {
  message: string;
}

export default function DocumentChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("doc");

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const streamingRef = useRef("");
  const optionsRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { register, handleSubmit, watch, reset, setValue } =
    useForm<MessageFormValues>({ defaultValues: { message: "" } });
  const messageValue = watch("message");

  const { me } = useAuth();
  const { data: user } = me;

  const { documentById } = useDocument(user?._id ?? "", docId ?? "");
  const { data: documentData, isLoading: docLoading } = documentById;

  const { chatByDocument, sendMessageStream } = useChat(user?._id || "");
  const { data: chat, isLoading: chatLoading } = chatByDocument(docId || "");

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOptionsOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target as Node)
      ) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOptionsOpen]);

  // Sync messages from server
  useEffect(() => {
    if (chat?.messages) {
      setMessagesData(chat.messages);
    }
  }, [chat]);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Auto-scroll on new messages or streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData, streamingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [messageValue]);

  // Get visible messages
  const totalMessages = messagesData.length;
  const hasMore = totalMessages > visibleCount;
  const visibleMessages = messagesData.slice(
    Math.max(0, totalMessages - visibleCount),
  );

  const loadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

  const onSubmit = useCallback(
    async (values: MessageFormValues) => {
      if (!values.message.trim() || !docId || isTyping) return;
      const userMessage = values.message.trim();

      // Optimistically add user message
      setMessagesData((prev) => [
        ...prev,
        { role: "user", content: userMessage, createdAt: new Date() },
      ]);
      reset();
      setIsTyping(true);
      streamingRef.current = "";
      setStreamingMessage("");

      try {
        await sendMessageStream(
          { documentId: docId, question: userMessage },
          (chunk) => {
            streamingRef.current += chunk;
            setStreamingMessage(streamingRef.current);
          },
          () => {
            const finalContent = streamingRef.current;
            setIsTyping(false);
            setStreamingMessage("");
            streamingRef.current = "";
            setMessagesData((prev) => [
              ...prev,
              {
                role: "assistant",
                content: finalContent,
                createdAt: new Date(),
              },
            ]);
          },
        );
      } catch {
        toast.error("Error sending message");
        setIsTyping(false);
        setStreamingMessage("");
        streamingRef.current = "";
        setMessagesData((prev) => prev.slice(0, -1));
      }
    },
    [docId, isTyping, sendMessageStream, reset],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: any) => (
      <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
    ),
    li: ({ children }: any) => <li className="text-text/70">{children}</li>,
    code: ({ children }: any) => (
      <code className="bg-black/30 px-1.5 py-0.5 rounded text-[13px] text-primary/90">
        {children}
      </code>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-text/95">{children}</strong>
    ),
  };

  if (docLoading || chatLoading || !user) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[13px] text-text/50 font-sans">
            Loading conversation...
          </p>
        </div>
      </div>
    );
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

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(201,162,39,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
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

          {/* Options menu */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="p-2 rounded-lg text-text/50 hover:text-text/90 hover:bg-white/8 transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isOptionsOpen && (
              <div
                className="absolute top-full right-0 mt-2 z-40 min-w-45 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1.5 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1.5 mb-1">
                  <span className="text-[10px] text-text/30 font-sans tracking-widest uppercase">
                    Options
                  </span>
                </div>
                <div className="h-px bg-white/8 mb-1" />
                <DeleteMessagesModal
                  id={chat?._id || ""}
                  documentId={docId}
                  userId={user._id}
                  onAction={() => setIsOptionsOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          {messagesData.length === 0 && !isTyping ? (
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
                  {document.title}
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
          ) : (
            <div className="space-y-8">
              {/* Load more button */}
              {hasMore && (
                <div className="flex justify-center">
                  <button
                    onClick={loadMore}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[12px] text-text/50 font-sans hover:text-text/80 hover:border-white/20 transition-all"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    Load {Math.min(
                      PAGE_SIZE,
                      totalMessages - visibleCount,
                    )}{" "}
                    older messages
                  </button>
                </div>
              )}

              {visibleMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-white/5 border border-white/10"
                    } rounded-2xl px-5 py-4`}
                  >
                    <div
                      className={`text-[14px] leading-[1.8] font-sans ${
                        msg.role === "user" ? "text-text/90" : "text-text/80"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown components={markdownComponents}>
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
                        {user.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming bubble */}
              {streamingMessage && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="max-w-[85%] sm:max-w-[75%] bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <div className="text-[14px] leading-[1.8] font-sans text-text/80">
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown components={markdownComponents}>
                          {streamingMessage}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <span className="inline-block w-0.5 h-3.5 bg-primary/70 animate-pulse align-middle ml-0.5" />
                  </div>
                </div>
              )}

              {/* Typing dots */}
              {isTyping && !streamingMessage && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <footer className="relative z-10 border-t border-white/8 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4">
          <div className="relative">
            <textarea
              {...register("message")}
              ref={(e) => {
                register("message").ref(e);
                textareaRef.current = e;
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
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .prose { color: inherit; }
        .prose code { font-family: 'Courier New', monospace; }
      `}</style>
    </div>
  );
}
