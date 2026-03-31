import { AxiosError } from "@/types/api";
import { LearningSet } from "@/types/learning-set";
import { useQuery } from "@tanstack/react-query";
import learningSetKeys from "./learning-set.keys";
import { fetchLearningSetById } from "./learning-set.api";

export const useLearningSetById = (id: string) => {
  return useQuery<LearningSet, AxiosError>({
    queryKey: learningSetKeys.byId(id),
    queryFn: () => fetchLearningSetById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
