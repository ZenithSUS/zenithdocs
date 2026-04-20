import { incrementDashboardMessageCache } from "@/features/dashboard/dashboard.cache";
import { dashboardKeys } from "@/features/dashboard/dashboard.keys";
import useGlobalChat from "@/features/global-chat/useGlobalChat";
import {
  appendGlobalMessagesToCache,
  removeGlobalMessageFromCache,
} from "@/features/global-message/global-message.cache";
import globalMessageKeys from "@/features/global-message/global-message.keys";
import {
  incrementUsageDailyMessagesCache,
  incrementUsageMessageDataBySixMonthsCache,
} from "@/features/usage/usage.cache";
import usageKeys from "@/features/usage/usage.keys";
import { handleNormalFetchError } from "@/helpers/api-error";
import { GlobalMessage } from "@/types/global-message";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
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
  const abortControllerRef = useRef<AbortController | null>(null);

  // Messages Reference
  const tempUserMessageIdRef = useRef<string | null>(null);
  const tempAiMessageIdRef = useRef<string | null>(null);

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

      tempUserMessageIdRef.current = tempMessage._id;

      appendGlobalMessagesToCache(
        queryClient,
        globalMessageKeys.byChatPage(chatId),
        tempMessage,
      );

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await sendGlobalMessageStream(
          userMessage,
          (chunk) => {
            accumulatedRef.current += chunk;
            setStreamingBubble({ content: accumulatedRef.current });
          },
          async () => {
            if (controller.signal.aborted) return;

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

            incrementDashboardMessageCache(
              queryClient,
              dashboardKeys.overview(),
            );

            incrementUsageMessageDataBySixMonthsCache(
              queryClient,
              usageKeys.byUserSixMonths(userId),
            );

            incrementUsageDailyMessagesCache(
              queryClient,
              usageKeys.dailyMessagesByUserAndMonth(
                userId,
                dayjs().format("YYYY-MM"),
              ),
            );
          },
          updateConfidence,
          controller.signal,
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") return; // Swallow abort errors

        handleNormalFetchError(error as Error, "Error sending global message");
        removeGlobalMessageFromCache(
          queryClient,
          globalMessageKeys.byChatPage(chatId),
          tempMessage._id,
        );

        if (tempAiMessageIdRef.current) {
          removeGlobalMessageFromCache(
            queryClient,
            globalMessageKeys.byChatPage(chatId),
            tempAiMessageIdRef.current,
          );

          tempAiMessageIdRef.current = null;
        }

        tempUserMessageIdRef.current = null;
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

  const handleStopStream = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsTyping(false);
    setStreamingBubble(null);

    if (tempUserMessageIdRef.current) {
      removeGlobalMessageFromCache(
        queryClient,
        globalMessageKeys.byChatPage(chatId),
        tempUserMessageIdRef.current,
      );

      tempUserMessageIdRef.current = null;
    }
  };

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

    // Stop Stream
    handleStopStream,

    // Stream
    isTyping,
    streamingBubble,
    confidence,
  };
};

export default useGlobalMessageStream;
