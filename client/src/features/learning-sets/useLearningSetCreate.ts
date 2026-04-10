import { LearningSet, LearningSetInput } from "@/types/learning-set";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createLearningSet } from "./learning-set.api";
import { toast } from "sonner";
import { handleApiError } from "@/helpers/api-error";
import learningSetKeys from "./learning-set.keys";
import { AxiosError } from "@/types/api";
import { addLearningSetCache } from "./learning-set.cache";
import { incrementAIRequestsCache } from "../usage/usage.cache";
import usageKeys from "../usage/usage.keys";
import { incrementDashboardAIRequestCache } from "../dashboard/dashboard.cache";
import { dashboardKeys } from "../dashboard/dashboard.keys";

export const useCreateLearningSet = (
  queryClient: QueryClient,
  userId: string,
) =>
  useMutation<LearningSet, AxiosError, LearningSetInput>({
    mutationKey: learningSetKeys.create(),
    mutationFn: (data) => createLearningSet(data),
    onSuccess: (newLearningSet) => {
      addLearningSetCache(
        queryClient,
        learningSetKeys.byUser(userId),
        newLearningSet,
      );

      incrementAIRequestsCache(queryClient, usageKeys.byUserSixMonths(userId));
      incrementDashboardAIRequestCache(queryClient, dashboardKeys.overview());

      toast.success("Learning set created successfully!");
    },
    onError: (err) => handleApiError(err, "Error creating learning set"),
  });
