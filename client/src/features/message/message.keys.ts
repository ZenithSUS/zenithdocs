const messageKeys = {
  all: ["message"] as const,
  byChat: (chatId: string) => [...messageKeys.all, chatId] as const,
  deleteByChatId: (chatId: string) =>
    [...messageKeys.byChat(chatId), "delete"] as const,
};

export default messageKeys;
