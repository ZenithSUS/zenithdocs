const userKeys = {
  all: ["users"] as const,
  searchByEmail: (searchQuery: string) =>
    [...userKeys.all, "searchByEmail", searchQuery] as const,
};

export default userKeys;
