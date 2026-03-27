import { create } from "zustand";

interface RetryStore {
  retries: Record<string, number>;
  increment: (key: string) => void;
  reset: (key: string) => void;
}

const useRetryStore = create<RetryStore>((set) => ({
  retries: {},
  increment: (key) =>
    set((state) => ({
      retries: { ...state.retries, [key]: (state.retries[key] ?? 0) + 1 },
    })),
  reset: (key) =>
    set((state) => ({
      retries: { ...state.retries, [key]: 0 },
    })),
}));

export default useRetryStore;
