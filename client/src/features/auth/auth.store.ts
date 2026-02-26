import { create } from "zustand";

interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));

export default useAuthStore;
