import api from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import Doc from "@/types/doc";

export const getDocumentByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data } = await api.get<ResponseWithPagedData<Doc, "documents">>(
    `/api/documents/user/${userId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return data.data;
};

export const getDocumentById = async (id: string) => {
  const { data } = await api.get<ResponseWithData<Doc>>(`/api/documents/${id}`);
  return data.data;
};
