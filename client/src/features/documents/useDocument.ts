import { InfiniteData, useQueryClient } from "@tanstack/react-query";

import { ResponseWithPagedData } from "@/types/api";
import Doc, { DocWithChat } from "@/types/doc";
import { useDocumentCreate } from "./useDocumentCreate";
import { useDocumentDelete } from "./useDocumentDelete";
import { useDocumentUpdate } from "./useDocumentUpdate";
import { useDocumentReprocess } from "./useDocumentReprocess";
import fetchLimits from "@/constants/fetch-limits";

export type DocumentPage = ResponseWithPagedData<Doc, "documents">["data"];
export type DocumentWithChatPage = ResponseWithPagedData<
  DocWithChat,
  "documents"
>["data"];

export type DocumentsInfiniteData = InfiniteData<DocumentPage>;
export type DocumentsWithChatInfiniteData = InfiniteData<DocumentWithChatPage>;

export type UpdateVariables = {
  id: string;
  data: Partial<Doc>;
};

export type MutationContext = {
  previousDoc?: DocumentsInfiniteData;
};

const useDocument = (userId: string, page: number = 1) => {
  const queryClient = useQueryClient();

  return {
    createDocumentMutation: useDocumentCreate(
      queryClient,
      userId,
      fetchLimits.document,
    ),
    deleteDocumentMutation: useDocumentDelete(
      queryClient,
      userId,
      fetchLimits.document,
      page,
    ),
    updateDocumentMutation: useDocumentUpdate(
      queryClient,
      userId,
      fetchLimits.document,
    ),
    reprocessDocumentMutation: useDocumentReprocess(),
  };
};

export default useDocument;
