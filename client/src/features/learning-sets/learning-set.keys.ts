const learningSetKeys = {
  all: ["learning-sets"] as const,
  byId: (id: string) => [...learningSetKeys.all, id] as const,
  byUser: (userId: string) => [...learningSetKeys.all, userId] as const,
  byUserPage: (userId: string, page: number) =>
    [...learningSetKeys.all, userId, page] as const,
  create: () => [...learningSetKeys.all, "create"] as const,
  update: () => [...learningSetKeys.all, "update"] as const,
  delete: () => [...learningSetKeys.all, "delete"] as const,
};

export default learningSetKeys;
