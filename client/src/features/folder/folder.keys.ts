const folderKeys = {
  all: ["folders"] as const,
  byId: (id: string) => [...folderKeys.all, id] as const,
  byUser: (userId: string) => [...folderKeys.all, userId] as const,
  byUserPage: (userId: string, page: number) =>
    [...folderKeys.byUser(userId), page] as const,
  create: () => [...folderKeys.all, "create"] as const,
  update: () => [...folderKeys.all, "update"] as const,
  delete: () => [...folderKeys.all, "delete"] as const,
};

export default folderKeys;
