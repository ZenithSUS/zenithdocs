import { api } from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { Summary } from "@/types/summary";

export const createSummary = async (data: Partial<Summary>) => {
  const { data: res } = await api.post<ResponseWithData<Summary>>(
    "/api/summaries",
    data,
  );

  return res.data;
};

export const fetchSummaryById = async (id: string) => {
  const { data: res } = await api.get<ResponseWithData<Summary>>(
    `/api/summaries/${id}`,
  );

  return res.data;
};

export const fetchSummaryByDocumentId = async (documentId: string) => {
  const { data: res } = await api.get<ResponseWithData<Summary>>(
    `/api/summaries/document/${documentId}`,
  );

  return res.data;
};

export const fetchSummaryByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<
    ResponseWithPagedData<Summary, "summaries">
  >(`/api/summaries/user/${userId}`, {
    params: {
      page,
      limit,
    },
  });

  return res.data;
};

export const updateSummaryById = async (id: string, data: Partial<Summary>) => {
  const { data: res } = await api.put<ResponseWithData<Summary>>(
    `/api/summaries/${id}`,
    data,
  );
  return res.data;
};

export const deleteSummaryById = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<Summary>>(
    `/api/summaries/${id}`,
  );
  return res.data;
};
