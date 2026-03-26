import { useMemo } from "react";
import DocumentChatHeader from "./DocumentChatHeader";
import usePublicChatScreen from "./hooks/usePublicChatScreen";
import MessageInputArea from "./MessageInputArea";
import StartingChatScreen from "./StartingChatScreen";
import MessageCard from "./MessageCard";
import { Message } from "@/types/message";

interface DocumentPublicChatProps {
  shareToken: string;
  documentTitle: string;
}

function DocumentPublicChat({
  shareToken,
  documentTitle,
}: DocumentPublicChatProps) {
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
    messages,
    textareaRef,
    messagesEndRef,
  } = usePublicChatScreen(shareToken);

  const messagesNodes = useMemo(
    () =>
      messages.map((msg: Message) => (
        <MessageCard key={msg._id} message={msg} />
      )),
    [messages],
  );

  return (
    <div className="h-full flex flex-col bg-background">
      <DocumentChatHeader isTyping={isTyping} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && !isTyping ? (
          <StartingChatScreen
            setValue={setValue}
            documentTitle={documentTitle}
          />
        ) : (
          <div className="space-y-4">{messagesNodes}</div>
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

export default DocumentPublicChat;
