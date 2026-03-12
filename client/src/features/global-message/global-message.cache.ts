import { ResponseWithPagedData } from "@/types/api";
import { GlobalMessage } from "@/types/global-message";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type GlobalMessagePage = ResponseWithPagedData<
  GlobalMessage,
  "globalMessages"
>["data"];
type GlobalMessageInfiniteData = InfiniteData<GlobalMessagePage>;

// Append a new global message to the cache
export const appendGlobalMessagesToCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  globalMessage: GlobalMessage,
) => {
  queryClient.setQueryData<GlobalMessageInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return;

    // Always append to page index 0 (newest page, rendered last after reversal)
    return {
      ...oldData,
      pages: oldData.pages.map((page, i) => ({
        ...page,
        globalMessages:
          i === 0
            ? [globalMessage, ...page.globalMessages]
            : page.globalMessages,
      })),
    };
  });
};

// Remove a global message from the cache
export const removeGlobalMessageFromCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  tempId: string,
) => {
  queryClient.setQueryData<GlobalMessageInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        globalMessages: page.globalMessages.filter(
          (message) => message._id !== tempId,
        ),
      })),
    };
  });
};

// Clear global messages
export const clearGlobalMessages = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData<GlobalMessageInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        globalMessages: [],
        pagination: { ...page.pagination, total: 0, page: 1 },
      })),
    };
  });
};
