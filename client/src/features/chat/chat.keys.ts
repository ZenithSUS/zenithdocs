const chatKeys = {
  all: ["chats"] as const,
  byId: (id: string) => [...chatKeys.all, id] as const,
  byDocumentUser: (documentId: string, userId: string) =>
    [...chatKeys.all, documentId, userId] as const,
  update: () => [...chatKeys.all, "update"] as const,
  create: () => [...chatKeys.all, "create"] as const,
  delete: () => [...chatKeys.all, "delete"] as const,
};

export type ChatKeys = typeof chatKeys;
export default chatKeys;
