import useChat from "@/features/chat/useChat";
import { Message } from "@/types/chat";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface MessageFormValues {
  message: string;
}

export interface StreamingBubble {
  content: string;
}

interface UsePublicMessageStreamOptions {
  shareToken: string;
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
}

const usePublicMessageStream = ({
  shareToken,
  messages,
  addMessage,
  removeMessage,
}: UsePublicMessageStreamOptions) => {
  const accumulatedRef = useRef("");
  const confidenceRef = useRef(0);
  const messageIdRef = useRef(0);

  const [isTyping, setIsTyping] = useState(false);
  const [streamingBubble, setStreamingBubble] =
    useState<StreamingBubble | null>(null);
  const [confidence, setConfidence] = useState(0);

  const { register, handleSubmit, watch, reset, setValue } =
    useForm<MessageFormValues>({ defaultValues: { message: "" } });

  const messageValue = watch("message");

  const { sendPublicMessageStream } = useChat("");

  const updateConfidence = useCallback((confidence: number) => {
    confidenceRef.current = confidence;
    setConfidence(confidence);
  }, []);

  const onSubmit = useCallback(
    async (values: MessageFormValues) => {
      if (!values.message.trim() || isTyping || !shareToken) return;

      const userMessage = values.message.trim();
      accumulatedRef.current = "";
      reset();
      setIsTyping(true);
      setStreamingBubble({ content: "" });

      const userMessageId = `msg-${++messageIdRef.current}`;
      const assistantMessageId = `msg-${++messageIdRef.current}`;

      addMessage({
        _id: userMessageId,
        role: "user",
        content: userMessage,
        createdAt: new Date(),
      });

      try {
        await sendPublicMessageStream(
          {
            shareToken,
            question: userMessage,
            history: messages,
          },
          (chunk) => {
            accumulatedRef.current += chunk;
            setStreamingBubble({ content: accumulatedRef.current });
          },
          async () => {
            const finalContent = accumulatedRef.current.trimEnd();
            setIsTyping(false);
            setStreamingBubble(null);

            addMessage({
              _id: assistantMessageId,
              role: "assistant",
              content: finalContent,
              createdAt: new Date(),
              confidenceScore: confidenceRef.current,
            });
          },
          updateConfidence,
        );
      } catch {
        toast.error("Failed to send message, please try again.");
        setIsTyping(false);
        setStreamingBubble(null);
        accumulatedRef.current = "";
        removeMessage(userMessageId);
      }
    },
    [sendPublicMessageStream, isTyping, shareToken, addMessage],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return {
    register,
    handleKeyDown,
    setValue,
    messageValue,
    onSubmit,
    handleSubmit,
    isTyping,
    streamingBubble,
    confidence,
  };
};

export default usePublicMessageStream;
