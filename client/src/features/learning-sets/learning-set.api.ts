import { api } from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { LearningSet, LearningSetInput } from "@/types/learning-set";

export const createLearningSet = async (data: LearningSetInput) => {
  const { data: res } = await api.post<ResponseWithData<LearningSet>>(
    "/learning-sets",
    data,
  );

  return res.data;
};

export const fetchLearningSetById = async (id: string) => {
  const { data: res } = await api.get<ResponseWithData<LearningSet>>(
    `/learning-sets/${id}`,
  );

  return res.data;
};

export const fetchLearningSetsByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<
    ResponseWithPagedData<LearningSet, "learningSets">
  >(`/learning-sets/user/${userId}`, {
    params: {
      page,
      limit,
    },
  });

  return res.data;
};

export const updateLearningSet = async (
  id: string,
  data: Partial<LearningSetInput>,
) => {
  const { data: res } = await api.put<ResponseWithData<LearningSet>>(
    `/learning-sets/${id}`,
    data,
  );

  return res.data;
};

export const deleteLearningSet = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<LearningSet>>(
    `/learning-sets/${id}`,
  );

  return res.data;
};
