const userKeys = {
  all: ["users"] as const,
  matchByEmail: (email: string) =>
    [...userKeys.all, "matchByEmail", email] as const,
};

export default userKeys;
