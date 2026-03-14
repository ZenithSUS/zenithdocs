const documentKeys = {
  all: ["documents"] as const,
  byId: (id: string) => [...documentKeys.all, id] as const,
  byUser: (userId: string) => [...documentKeys.all, userId] as const,
  byFolder: (folderId: string) => [...documentKeys.all, folderId] as const,
  byUserPage: (userId: string, page: number) =>
    [...documentKeys.byUser(userId), page] as const,
  byUserWithChatPage: (userId: string) =>
    [...documentKeys.byUser(userId), "chats"] as const,
  create: () => [...documentKeys.all, "create"] as const,
  update: () => [...documentKeys.all, "update"] as const,
  delete: () => [...documentKeys.all, "delete"] as const,
  upload: () => [...documentKeys.all, "upload"] as const,
  reprocess: () => [...documentKeys.all, "reprocess"] as const,
};

export type DocumentKeys = typeof documentKeys;

export default documentKeys;
