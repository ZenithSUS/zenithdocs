import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import useChat from "@/features/chat/useChat";
import {
  appendMessageToCache,
  removeMessageFromCache,
} from "@/features/message/message.cache";
import { Message } from "@/types/message";
import messageKeys from "@/features/message/message.keys";
import documentKeys from "@/features/documents/document.keys";
import { handleNormalFetchError } from "@/helpers/api-error";
import { incrementDashboardMessageCache } from "@/features/dashboard/dashboard.cache";
import { dashboardKeys } from "@/features/dashboard/dashboard.keys";

export interface MessageFormValues {
  message: string;
}

export interface StreamingBubble {
  content: string;
}

interface UseMessageStreamOptions {
  docId: string;
  chatId: string;
  userId: string;
}

const useMessageStream = ({
  docId,
  chatId,
  userId,
}: UseMessageStreamOptions) => {
  const queryClient = useQueryClient();
  const accumulatedRef = useRef("");
  const confidenceRef = useRef(0);

  const [isTyping, setIsTyping] = useState(false);
  const [streamingBubble, setStreamingBubble] =
    useState<StreamingBubble | null>(null);
  const [confidence, setConfidence] = useState(0);

  const { register, handleSubmit, watch, reset, setValue } =
    useForm<MessageFormValues>({ defaultValues: { message: "" } });

  const messageValue = watch("message");

  const { sendMessageStream } = useChat(userId);

  const updateConfidence = useCallback((confidence: number) => {
    confidenceRef.current = confidence;
    setConfidence(confidence);
  }, []);

  const onSubmit = useCallback(
    async (values: MessageFormValues) => {
      if (!values.message.trim() || !docId || isTyping || !chatId) return;

      const userMessage = values.message.trim();
      accumulatedRef.current = "";
      reset();
      setIsTyping(true);
      setStreamingBubble({ content: "" });

      const tempUserMessage: Message = {
        _id: `temp-user-${Date.now()}`,
        chatId,
        userId,
        role: "user",
        content: userMessage,
        createdAt: new Date(),
      };

      appendMessageToCache(
        queryClient,
        messageKeys.byChat(chatId),
        tempUserMessage,
      );

      incrementDashboardMessageCache(queryClient, dashboardKeys.overview());

      try {
        await sendMessageStream(
          { documentId: docId, question: userMessage },

          (chunk) => {
            accumulatedRef.current += chunk;
            setStreamingBubble({ content: accumulatedRef.current });
          },

          async () => {
            const finalContent = accumulatedRef.current.trimEnd();
            setStreamingBubble(null);
            setIsTyping(false);

            const aiMessage: Message = {
              _id: `temp-ai-${Date.now()}`,
              chatId,
              userId,
              role: "assistant",
              content: finalContent,
              confidenceScore: confidenceRef.current,
              createdAt: new Date(),
            };

            appendMessageToCache(
              queryClient,
              messageKeys.byChat(chatId),
              aiMessage,
            );
          },
          updateConfidence,
        );

        queryClient.invalidateQueries({
          queryKey: documentKeys.byUserWithChatPage(userId),
        });
      } catch (error) {
        handleNormalFetchError(
          error as Error,
          "Error sending message. Please try again later.",
        );
        removeMessageFromCache(
          queryClient,
          messageKeys.byChat(chatId),
          tempUserMessage._id,
        );
        setStreamingBubble(null);
        setIsTyping(false);
      }
    },
    [docId, chatId, isTyping, sendMessageStream, reset, queryClient, userId],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return {
    // Form
    register,
    handleSubmit,
    setValue,
    messageValue,
    onSubmit,
    handleKeyDown,
    // Stream state
    isTyping,
    streamingBubble,
    confidence,
  };
};

export default useMessageStream;
