import { AxiosError, ResponseWithPagedData } from "@/types/api";
import { Message } from "@/types/message";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import messageKeys from "./message.keys";
import {
  deleteMessagesByChatId,
  fetchMessagesByChatIdPaginated,
} from "./message.api";
import { clearMessagesCache } from "./message.cache";

interface useMessageProps {
  chatId: string;
}

type MessagePage = ResponseWithPagedData<Message, "messages">["data"];

const useMessage = ({ chatId }: useMessageProps) => {
  const queryClient = useQueryClient();
  const messageLimit = 10;

  const messagesByChatPage = useInfiniteQuery<
    MessagePage,
    AxiosError,
    InfiniteData<MessagePage>,
    ReturnType<typeof messageKeys.byChat>,
    number
  >({
    queryKey: messageKeys.byChat(chatId),
    queryFn: ({ pageParam = 1 }) =>
      fetchMessagesByChatIdPaginated(chatId, pageParam, messageLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        messages: [...page.messages].reverse(),
      })),
    }),
    enabled: !!chatId,
  });

  const deleteMessageByChatMutation = useMutation<Message, AxiosError, string>({
    mutationKey: messageKeys.deleteByChatId(chatId),
    mutationFn: () => deleteMessagesByChatId(chatId),
    onMutate: () => {
      // Optimistically wipe cache immediately on delete
      clearMessagesCache(queryClient, messageKeys.byChat(chatId));
    },
    onError: () => {
      // On failure, refetch to restore actual state
      messagesByChatPage.refetch();
    },
  });

  return { messagesByChatPage, deleteMessageByChatMutation };
};

export default useMessage;
