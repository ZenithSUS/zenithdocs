import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { GlobalMessage } from "@/types/global-message";
import { ResponseWithPagedData } from "@/types/api";
import { useGlobalMessageDelete } from "./useGlobalMessageDelete";

export type GlobalMessagePage = ResponseWithPagedData<
  GlobalMessage,
  "globalMessages"
>["data"];
export type GlobalMessageInfiniteData = InfiniteData<GlobalMessagePage>;

const useGlobalMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return {
    deleteGlobalMessageMutation: useGlobalMessageDelete(queryClient, chatId),
  };
};

export default useGlobalMessage;
