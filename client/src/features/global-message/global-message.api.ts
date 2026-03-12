import { api } from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { GlobalMessage } from "@/types/global-message";

export const fetchGlobalMessagesByChatIdPaginated = async (
  chatId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<
    ResponseWithPagedData<GlobalMessage, "globalMessages">
  >(`/api/global-messages/chat/${chatId}`, {
    params: {
      page,
      limit,
    },
  });

  return res.data;
};

export const deleteGlobalMessagesByChatId = async (chatId: string) => {
  const { data: res } = await api.delete<ResponseWithData<GlobalMessage>>(
    `/api/global-messages/chat/${chatId}`,
  );
  return res.data;
};
