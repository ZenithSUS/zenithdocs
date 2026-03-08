import { Message } from "@/types/chat";
import { ResponseWithPagedData } from "@/types/api";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type MessagePage = ResponseWithPagedData<Message, "messages">["data"];
type MessagesInfiniteData = InfiniteData<MessagePage>;

// Append a new message to the last page (most recent) in the cache
export const appendMessageToCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  message: Message,
) => {
  queryClient.setQueryData<MessagesInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    // Always append to page index 0 (newest page, rendered last after reversal)
    return {
      ...oldData,
      pages: oldData.pages.map((page, i) =>
        i === 0 ? { ...page, messages: [message, ...page.messages] } : page,
      ),
    };
  });
};

// Remove a message from the cache by a temp id (for rollback or dedup)
export const removeMessageFromCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  tempId: string,
) => {
  queryClient.setQueryData<MessagesInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        messages: page.messages.filter((m) => (m as any)._id !== tempId),
      })),
    };
  });
};

// Replace a temp message with the real one (or update content)
export const replaceMessageInCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  tempId: string,
  updated: Partial<Message>,
) => {
  queryClient.setQueryData<MessagesInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        messages: page.messages.map((m) =>
          m._id === tempId ? { ...m, ...updated } : m,
        ),
      })),
    };
  });
};

// Wipe all messages across all pages (used on delete)
export const clearMessagesCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData<MessagesInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        messages: [],
      })),
    };
  });
};
