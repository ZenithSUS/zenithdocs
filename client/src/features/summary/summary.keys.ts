const summaryKeys = {
  all: ["summary"],
  byId: (id: string) => [...summaryKeys.all, id] as const,
  byUser: (userId: string) => [...summaryKeys.all, userId] as const,
  byUserPage: (userId: string, page: number) =>
    [...summaryKeys.byUser(userId), page] as const,
  byFolder: (folderId: string) => [...summaryKeys.all, folderId] as const,
  create: () => [...summaryKeys.all, "create"] as const,
  update: () => [...summaryKeys.all, "update"] as const,
  delete: () => [...summaryKeys.all, "delete"] as const,
};

export type SummaryKeys = typeof summaryKeys;
export default summaryKeys;
