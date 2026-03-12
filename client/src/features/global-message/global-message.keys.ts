const globalMessageKeys = {
  all: ["globalMessage"] as const,
  byChatPage: (chatId: string) => [
    ...globalMessageKeys.all,
    chatId,
    "paginated",
  ],
  delete: () => [...globalMessageKeys.all, "delete"] as const,
};

export default globalMessageKeys;
