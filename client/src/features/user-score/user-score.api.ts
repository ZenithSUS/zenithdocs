import { api } from "@/lib/axios";
import { ResponseWithData } from "@/types/api";
import { UserScore, UserScoreInput } from "@/types/user-score";

export const createUserScore = async (data: UserScoreInput) => {
  const { data: res } = await api.post<ResponseWithData<UserScore>>(
    "/api/user-scores",
    data,
  );

  return res.data;
};

export const getUserScoreById = async (id: string) => {
  const { data: res } = await api.get<ResponseWithData<UserScore>>(
    `/api/user-scores/${id}`,
  );

  return res.data;
};

export const getUserScoreByUserAndLearningSetId = async (
  userId: string,
  learningSetId: string,
) => {
  const { data: res } = await api.get<ResponseWithData<UserScore>>(
    `/api/user-scores/user/${userId}/learning-set/${learningSetId}`,
  );

  return res.data;
};

export const updateUserScore = async (
  id: string,
  data: Partial<UserScoreInput>,
) => {
  const { data: res } = await api.put<ResponseWithData<UserScore>>(
    `/api/user-scores/${id}`,
    data,
  );

  return res.data;
};

export const deleteUserScore = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<UserScore>>(
    `/api/user-scores/${id}`,
  );

  return res.data;
};
