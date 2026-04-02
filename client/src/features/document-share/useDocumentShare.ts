import { useQuery, useQueryClient } from "@tanstack/react-query";
import documentShareKeys from "./document-share.keys";
import { fetchDocumentShareByToken } from "./document-share.api";
import {
  DocumentShare,
  DocumentShareInput,
  UpdateDocumentShareInput,
} from "@/types/document-share";
import { AxiosError, ResponseWithPagedData } from "@/types/api";

import { DocumentShareInfo } from "@/types/doc";
import useAuthStore from "../auth/auth.store";
import { useDocumentShareCreate } from "./useDocumentShareCreate";
import { useDocumentShareUpdate } from "./useDocumentShareUpdate";
import { useDocumentShareDelete } from "./useDocumentShareDelete";

export type DocumentSharePage = ResponseWithPagedData<
  DocumentShare,
  "documentShares"
>["data"];

export type UpdateVariables = {
  id: string;
  data: UpdateDocumentShareInput;
  document?: DocumentShareInfo;
};

export type MutateContext = {
  previousDocumentShares: DocumentSharePage | undefined;
};

export type CreateDocumentShareVariables = {
  data: DocumentShareInput;
  document: DocumentShareInfo;
};

const useDocumentShare = (userId: string, page: number = 1) => {
  const queryClient = useQueryClient();
  const { email } = useAuthStore();

  return {
    createDocumentShareMutation: useDocumentShareCreate(
      queryClient,
      userId,
      email,
    ),
    updateDocumentShareMutation: useDocumentShareUpdate(
      queryClient,
      userId,
      email,
      page,
    ),
    deleteDocumentShareMutation: useDocumentShareDelete(
      queryClient,
      userId,
      page,
    ),
  };
};

export default useDocumentShare;
