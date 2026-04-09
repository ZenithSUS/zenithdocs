import { incrementDashboardMessageCache } from "@/features/dashboard/dashboard.cache";
import { dashboardKeys } from "@/features/dashboard/dashboard.keys";
import useGlobalChat from "@/features/global-chat/useGlobalChat";
import {
  appendGlobalMessagesToCache,
  removeGlobalMessageFromCache,
} from "@/features/global-message/global-message.cache";
import globalMessageKeys from "@/features/global-message/global-message.keys";
import { handleNormalFetchError } from "@/helpers/api-error";
import { GlobalMessage } from "@/types/global-message";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export interface GlobalMessageFormValues {
  message: string;
}

export interface StreamingBubble {
  content: string;
}

interface useGlobalMessageStreamProps {
  chatId: string;
  userId: string;
}

const useGlobalMessageStream = ({
  chatId,
  userId,
}: useGlobalMessageStreamProps) => {
  const queryClient = useQueryClient();
  const accumulatedRef = useRef("");
  const confidenceRef = useRef(0);

  const [isTyping, setIsTyping] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [streamingBubble, setStreamingBubble] =
    useState<StreamingBubble | null>(null);

  const { register, handleSubmit, watch, reset, setValue } =
    useForm<GlobalMessageFormValues>({
      defaultValues: { message: "" },
    });

  const updateConfidence = useCallback((value: number) => {
    confidenceRef.current = value;
    setConfidence(value);
  }, []);

  const messageValue = watch("message");

  const { sendGlobalMessageStream } = useGlobalChat(userId);
  const onSubmit = useCallback(
    async (values: GlobalMessageFormValues) => {
      if (!values.message.trim() || !chatId || isTyping) return;

      const userMessage = values.message.trim();
      accumulatedRef.current = "";
      reset();
      setIsTyping(true);
      setStreamingBubble({ content: "" });

      const tempMessage: GlobalMessage = {
        _id: `temp-user-${Date.now()}`,
        chatId,
        userId,
        role: "user",
        content: userMessage,
        createdAt: new Date(),
      };

      appendGlobalMessagesToCache(
        queryClient,
        globalMessageKeys.byChatPage(chatId),
        tempMessage,
      );

      incrementDashboardMessageCache(queryClient, dashboardKeys.overview());

      try {
        await sendGlobalMessageStream(
          userMessage,
          (chunk) => {
            accumulatedRef.current += chunk;
            setStreamingBubble({ content: accumulatedRef.current });
          },
          async () => {
            const finalContent = accumulatedRef.current.trimEnd();
            setIsTyping(false);
            setStreamingBubble(null);

            const aiMessage: GlobalMessage = {
              _id: `temp-ai-${Date.now()}`,
              chatId,
              userId,
              role: "assistant",
              content: finalContent,
              confidenceScore: confidenceRef.current,
              createdAt: new Date(),
            };

            appendGlobalMessagesToCache(
              queryClient,
              globalMessageKeys.byChatPage(chatId),
              aiMessage,
            );
          },
          updateConfidence,
        );
      } catch (error) {
        handleNormalFetchError(error as Error, "Error sending global message");
        removeGlobalMessageFromCache(
          queryClient,
          globalMessageKeys.byChatPage(chatId),
          tempMessage._id,
        );
        setIsTyping(false);
        setStreamingBubble(null);
      }
    },
    [
      chatId,
      isTyping,
      queryClient,
      sendGlobalMessageStream,
      userId,
      reset,
      updateConfidence,
    ],
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
    watch,
    reset,
    setValue,
    messageValue,
    handleKeyDown,
    onSubmit,

    // Stream
    isTyping,
    streamingBubble,
    confidence,
  };
};

export default useGlobalMessageStream;
