import { create } from "zustand";

interface AuthStore {
  userId: string | null;
  setUserId: (id: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  email: null,
  setEmail: (email) => set({ email }),
}));

export default useAuthStore;
