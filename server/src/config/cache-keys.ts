const CacheKeys = {
  questionEmbedding: (question: string) => `global-embedding-${question}`,
  userInfo: (userId: string) => `user-info-${userId}`,
  dashboardStable: (userId: string) => `dashboard-stable-${userId}`,
} as const;

export default CacheKeys;
