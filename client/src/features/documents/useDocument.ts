import { InfiniteData, useQueryClient } from "@tanstack/react-query";

import { ResponseWithPagedData } from "@/types/api";
import Doc, { DocWithChat } from "@/types/doc";
import { useDocumentCreate } from "./useDocumentCreate";
import { useDocumentDelete } from "./useDocumentDelete";
import { useDocumentUpdate } from "./useDocumentUpdate";
import { useDocumentReprocess } from "./useDocumentReprocess";

export type DocumentPage = ResponseWithPagedData<Doc, "documents">["data"];
export type DocumentWithChatPage = ResponseWithPagedData<
  DocWithChat,
  "documents"
>["data"];

export type DocumentsInfiniteData = InfiniteData<DocumentPage>;

export type UpdateVariables = {
  id: string;
  data: Partial<Doc>;
};

export type MutationContext = {
  previousDoc?: DocumentsInfiniteData;
};

const useDocument = (userId: string) => {
  const queryClient = useQueryClient();
  const documentLimit = 10;

  return {
    createDocumentMutation: useDocumentCreate(
      queryClient,
      userId,
      documentLimit,
    ),
    deleteDocumentMutation: useDocumentDelete(
      queryClient,
      userId,
      documentLimit,
    ),
    updateDocumentMutation: useDocumentUpdate(
      queryClient,
      userId,
      documentLimit,
    ),
    reprocessDocumentMutation: useDocumentReprocess(),
  };
};

export default useDocument;
