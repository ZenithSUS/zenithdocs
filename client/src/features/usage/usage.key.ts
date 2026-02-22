const usageKeys = {
  all: ["usage"] as const,
  byUser: (userId: string) => [...usageKeys.all, userId] as const,
  byUserAndMonth: (userId: string, month: string) =>
    [...usageKeys.byUser(userId), month] as const,
};

export type UsageKeys = typeof usageKeys;

export default usageKeys;
