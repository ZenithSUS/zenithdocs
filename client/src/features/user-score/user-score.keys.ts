const userScoreKeys = {
  all: ["user-scores"] as const,
  byId: (id: string) => [...userScoreKeys.all, id] as const,
  byUserAndLearningSet: (userId: string, learningSetId: string) =>
    [...userScoreKeys.all, userId, learningSetId] as const,
  create: () => [...userScoreKeys.all, "create"] as const,
  update: () => [...userScoreKeys.all, "update"] as const,
  delete: () => [...userScoreKeys.all, "delete"] as const,
};
