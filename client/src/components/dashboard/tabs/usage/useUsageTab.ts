import useUsage from "@/features/usage/useUsage";

interface UseUsageTabOptions {
  userId: string;
  currentMonth: string;
  tokenLimit: number;
  currentTokensUsed: number;
}

const useUsageTab = ({
  userId,
  currentMonth,
  tokenLimit,
  currentTokensUsed,
}: UseUsageTabOptions) => {
  const { usageByUserSixMonths } = useUsage(userId, currentMonth);
  const { data: usage = [] } = usageByUserSixMonths;

  const tokensUsed = Math.min(tokenLimit, currentTokensUsed);
  const remainingTokens = Math.max(0, tokenLimit - currentTokensUsed);
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
    usage,
    tokensUsed,
    remainingTokens,
    documentsThisMonth,
    nextMonthLabel,
  };
};

export default useUsageTab;
