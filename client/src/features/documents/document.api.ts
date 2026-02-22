import api from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import Doc from "@/types/doc";

export const createDocument = async (data: Partial<Doc>) => {
  const { data: res } = await api.post("/api/documents", data);
  return res;
};

export const fetchDocumentByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<ResponseWithPagedData<Doc, "documents">>(
    `/api/documents/user/${userId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return res.data;
};

export const fetchDocumentById = async (id: string) => {
  const { data: res } = await api.get<ResponseWithData<Doc>>(
    `/api/documents/${id}`,
  );
  return res.data;
};

export const updateDocumentById = async (id: string, data: Partial<Doc>) => {
  const { data: res } = await api.put<ResponseWithData<Doc>>(
    `/api/documents/${id}`,
    data,
  );
  return res.data;
};

export const deleteDocumentById = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<Doc>>(
    `/api/documents/${id}`,
  );
  return res.data;
};
