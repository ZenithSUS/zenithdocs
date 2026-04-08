import { useUsageByUserSixMonths } from "@/features/usage/useUsageByUserSixMonths";
import { useUsageDailyMessagesByUserAndMonth } from "@/features/usage/useUsageDailyMessagesByUserAndMonth";

interface UseUsageTabOptions {
  userId: string;
  currentMonth: string;
}

const useUsageTab = ({ userId, currentMonth }: UseUsageTabOptions) => {
  const {
    data: usage = [],
    isLoading: isLoadingUsage,
    isError: usageError,
    error: usageErrorData,
    refetch: refetchUsage,
  } = useUsageByUserSixMonths(userId, currentMonth);
  const {
    data: userDailyMessages,
    isLoading: isLoadingDailyMessages,
    isError: dailyMessagesError,
    error: dailyMessagesErrorData,
    refetch: refetchDailyMessagesUsage,
  } = useUsageDailyMessagesByUserAndMonth(userId, currentMonth);

  const isUsageTabError = usageError || dailyMessagesError;
  const usageErrorInfo = usageErrorData || dailyMessagesErrorData;

  const refetchUsagePage = async () => {
    await Promise.all([refetchUsage(), refetchDailyMessagesUsage()]);
  };

  const documentsThisMonth =
    usage.find((u) => u.month === currentMonth)?.documentsUploaded || 0;

  const nextMonthDate = new Date(
    new Date().setMonth(new Date().getMonth() + 1),
  );

  nextMonthDate.setDate(1);

  const nextMonthLabel = nextMonthDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return {
    // Usage Six Months
    usage,
    isLoadingUsage,

    // User Daily Messages
    userDailyMessages,
    isLoadingDailyMessages,

    // Errors
    isUsageTabError,
    usageErrorInfo,

    // Refetch
    refetchUsagePage,

    // Utils
    documentsThisMonth,
    nextMonthLabel,
  };
};

export default useUsageTab;
