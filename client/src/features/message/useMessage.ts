import { ResponseWithPagedData } from "@/types/api";
import { Message } from "@/types/message";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageDelete } from "./useMessageDelete";

export type MessagePage = ResponseWithPagedData<Message, "messages">["data"];

const useMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return { deleteMessageByChatMutation: useMessageDelete(queryClient, chatId) };
};

export default useMessage;
