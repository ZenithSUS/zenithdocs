const documentKeys = {
  all: ["documents"] as const,
  byId: (id: string) => [...documentKeys.all, id] as const,
  byUser: (userId: string) => [...documentKeys.all, userId] as const,
  byFolder: (folderId: string) => [...documentKeys.all, folderId] as const,
  byUserPage: (userId: string, page: number) =>
    [...documentKeys.byUser(userId), page] as const,
  create: () => [...documentKeys.all] as const,
  update: () => [...documentKeys.all] as const,
  delete: (id: string) => [...documentKeys.byId(id)] as const,
};

export type DocumentKeys = typeof documentKeys;

export default documentKeys;
