const documentShareKeys = {
  all: ["document-share"] as const,
  byUserPage: (userId: string) =>
    [...documentShareKeys.all, userId, "page"] as const,
  byId: (id: string) => [...documentShareKeys.all, id, "id"] as const,
  byToken: (token: string) =>
    [...documentShareKeys.all, token, "token"] as const,
  create: () => [...documentShareKeys.all, "create"] as const,
  update: () => [...documentShareKeys.all, "update"] as const,
  delete: () => [...documentShareKeys.all, "delete"] as const,
} as const;

export default documentShareKeys;
