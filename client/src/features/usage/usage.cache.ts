import { DailyMessagesUsage, Usage } from "@/types/usage";
import { QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

export const incrementUsageMessageDataBySixMonthsCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData<Usage[]>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    const today = dayjs().format("YYYY-MM-DD");
    const currentMonth = dayjs().format("YYYY-MM");

    return oldData.map((usage) => {
      if (usage.month !== currentMonth) return usage;

      return {
        ...usage,
        aiRequests: usage.aiRequests + 1,
        totalMessages: usage.totalMessages + 1,
        dailyMessages: {
          ...usage.dailyMessages,
          ...(today in usage.dailyMessages &&
            usage.dailyMessages[today] !== null && {
              [today]: usage.dailyMessages[today] + 1,
            }),
        },
      };
    });
  });
};

export const incrementUsageDailyMessagesCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  const today = dayjs().format("YYYY-MM-DD");
  queryClient.setQueryData<DailyMessagesUsage>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      dailyMessages: {
        ...oldData.dailyMessages,
        [today]: oldData.dailyMessages[today] + 1,
      },
    };
  });
};

export const incrementAIRequestsCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData<Usage[]>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    return oldData.map((usage) => ({
      ...usage,
      aiRequests: usage.aiRequests + 1,
    }));
  });
};
