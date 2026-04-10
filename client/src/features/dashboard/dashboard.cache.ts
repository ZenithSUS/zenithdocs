import { DashboardOverview } from "@/types/dashboard";
import { QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

export const updateDashboardOverviewCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  data: Partial<DashboardOverview>,
) => {
  queryClient.setQueryData<DashboardOverview>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return { ...oldData, ...data };
  });
};

export const incrementDashboardMessageCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData<DashboardOverview>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    const today = dayjs().format("YYYY-MM-DD");
    const currentMonth = dayjs().format("YYYY-MM");

    return {
      ...oldData,
      dailyMessage: oldData.dailyMessage + 1,
      totalMessages: oldData.totalMessages + 1,
      totalAIRequests: oldData.totalAIRequests + 1,
      usageHistory: oldData.usageHistory.map((usage) => ({
        ...usage,
        dailyMessages: {
          ...usage.dailyMessages,
          ...(usage.month === currentMonth &&
            today in usage.dailyMessages &&
            usage.dailyMessages[today] !== null && {
              [today]: usage.dailyMessages[today] + 1,
            }),
        },
        aiRequests:
          usage.month === currentMonth
            ? usage.aiRequests + 1
            : usage.aiRequests,
        totalMessages:
          usage.month === currentMonth
            ? usage.totalMessages + 1
            : usage.totalMessages,
      })),
    };
  });
};

export const incrementDashboardAIRequestCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData<DashboardOverview>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    const currentMonth = dayjs().format("YYYY-MM");

    return {
      ...oldData,
      totalAIRequests: oldData.totalAIRequests + 1,
      usageHistory: oldData.usageHistory.map((usage) => ({
        ...usage,
        aiRequests:
          usage.month === currentMonth
            ? usage.aiRequests + 1
            : usage.aiRequests,
      })),
    };
  });
};
