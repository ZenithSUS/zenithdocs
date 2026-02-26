import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // data fresh for 5 mins, no refetch
      gcTime: 24 * 60 * 60 * 1000, // keep cache for 24 hours
      retry: false,
      refetchOnMount: false, // don't refetch when component mounts
      refetchOnWindowFocus: false, // don't refetch on tab focus
      refetchOnReconnect: true, // refetch on reconnect
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
