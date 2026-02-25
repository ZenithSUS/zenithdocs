export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  login: () => [...authKeys.all, "login"] as const,
  register: () => [...authKeys.all, "register"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
};

export type AuthKeys = typeof authKeys;
