import { api } from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { DocumentShare, DocumentShareInput } from "@/types/document-share";

export const createDocumentShare = async (data: DocumentShareInput) => {
  const { data: res } = await api.post<ResponseWithData<DocumentShare>>(
    "/api/document-shares",
    data,
  );
  return res.data;
};

export const fetchDocumentShareById = async (id: string) => {
  const { data: res } = await api.get<ResponseWithData<DocumentShare>>(
    `/api/document-shares/${id}`,
  );
  return res.data;
};

export const fetchDocumentShareByToken = async (token: string) => {
  const { data: res } = await api.get<ResponseWithData<DocumentShare>>(
    `/api/document-shares/token/${token}`,
  );
  return res.data;
};

export const fetchDocumentSharesByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<
    ResponseWithPagedData<DocumentShare, "documentShares">
  >(`/api/document-shares/user/${userId}`, {
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const updateDocumentShare = async (
  id: string,
  data: Partial<DocumentShare>,
) => {
  const { data: res } = await api.put<ResponseWithData<DocumentShare>>(
    `/api/document-shares/${id}`,
    data,
  );
  return res.data;
};

export const deleteDocumentShare = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<DocumentShare>>(
    `/api/document-shares/${id}`,
  );
  return res.data;
};
