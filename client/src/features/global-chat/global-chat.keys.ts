const globalChatKeys = {
  all: ["globalChat"] as const,
  init: () => [...globalChatKeys.all, "init"] as const,
  byUserId: (userId: string) => [...globalChatKeys.all, userId] as const,
  create: () => [...globalChatKeys.all, "create"] as const,
  delete: () => [...globalChatKeys.all, "delete"] as const,
};

export default globalChatKeys;
