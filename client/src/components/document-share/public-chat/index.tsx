import DocumentChatHeader from "../DocumentChatHeader";
import usePublicChatScreen from "../hooks/usePublicChatScreen";

interface DocumentPublicChatProps {
  shareToken: string;
}

function DocumentPublicChat({ shareToken }: DocumentPublicChatProps) {
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
    textAreaRef,
    messagesEndRef,
  } = usePublicChatScreen(shareToken);

  return (
    <div className="h-full flex flex-col bg-background">
      <DocumentChatHeader isTyping={isTyping} />
    </div>
  );
}

export default DocumentPublicChat;
