import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import globalMessageKeys from "./global-message.keys";
import { GlobalMessage } from "@/types/global-message";
import { AxiosError, ResponseWithPagedData } from "@/types/api";
import {
  deleteGlobalMessagesByChatId,
  fetchGlobalMessagesByChatIdPaginated,
} from "./global-message.api";
import { clearGlobalMessages } from "./global-message.cache";

type GlobalMessagePage = ResponseWithPagedData<
  GlobalMessage,
  "globalMessages"
>["data"];
type GlobalMessageInfiniteData = InfiniteData<GlobalMessagePage>;

const useGlobalMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  const globalMessageLimit = 10;

  const globalMessagesByChatPage = useInfiniteQuery<
    GlobalMessagePage,
    AxiosError,
    GlobalMessageInfiniteData,
    ReturnType<typeof globalMessageKeys.byChatPage>,
    number
  >({
    queryKey: globalMessageKeys.byChatPage(chatId),
    queryFn: ({ pageParam = 1 }) =>
      fetchGlobalMessagesByChatIdPaginated(
        chatId,
        pageParam,
        globalMessageLimit,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        globalMessages: [...page.globalMessages].reverse(),
      })),
    }),
    enabled: !!chatId,
  });

  const deleteGlobalMessageMutation = useMutation<
    GlobalMessage,
    AxiosError,
    string
  >({
    mutationKey: globalMessageKeys.delete(),
    mutationFn: deleteGlobalMessagesByChatId,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: globalMessageKeys.byChatPage(deletedId),
      });

      clearGlobalMessages(queryClient, globalMessageKeys.byChatPage(chatId));
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: globalMessageKeys.byChatPage(chatId),
      }),
  });

  return { globalMessagesByChatPage, deleteGlobalMessageMutation };
};

export default useGlobalMessage;
