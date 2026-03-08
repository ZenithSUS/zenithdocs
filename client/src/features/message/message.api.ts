import { api } from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { Message } from "@/types/message";

export const fetchMessagesByChatIdPaginated = async (
  chatId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<
    ResponseWithPagedData<Message, "messages">
  >(`/api/messages/chat/${chatId}`, {
    params: { page, limit },
  });
  return res.data;
};

export const deleteMessagesByChatId = async (chatId: string) => {
  const { data: res } = await api.delete<ResponseWithData<Message>>(
    `/api/messages/chat/${chatId}`,
  );
  return res.data;
};
