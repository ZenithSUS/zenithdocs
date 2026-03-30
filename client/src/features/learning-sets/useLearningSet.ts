import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import learningSetKeys from "./learning-set.keys";
import {
  createLearningSet,
  deleteLearningSet,
  fetchLearningSetById,
  fetchLearningSetsByUserPaginated,
  updateLearningSet,
} from "./learning-set.api";
import { LearningSet, LearningSetInput } from "@/types/learning-set";
import { AxiosError, ResponseWithPagedData } from "@/types/api";
import {
  addInfiniteLearningSet,
  removeInfiniteLearningSet,
  updateInfiniteLearningSet,
} from "./learning-set.cache";

type LearningSetPage = ResponseWithPagedData<
  LearningSet,
  "learningSets"
>["data"];

type LearningSetsInfiniteData = InfiniteData<LearningSetPage>;

type UpdateVariables = {
  id: string;
  data: Partial<LearningSet>;
};

type MutationContext = {
  previousLearningSets?: LearningSetsInfiniteData;
};

const useLearningSet = (userId: string) => {
  const queryClient = useQueryClient();
  const learningSetLimit = 10;

  const createLearningSetMutation = useMutation<
    LearningSet,
    AxiosError,
    LearningSetInput
  >({
    mutationKey: learningSetKeys.create(),
    mutationFn: (data) => createLearningSet(data),
    onSuccess: (newLearningSet) => {
      addInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        newLearningSet,
      );
    },
  });

  const learningSetById = (id: string) =>
    useQuery<LearningSet, AxiosError>({
      queryKey: learningSetKeys.byId(id),
      queryFn: () => fetchLearningSetById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const learningSetByUserPage = useInfiniteQuery<
    LearningSetPage,
    AxiosError,
    LearningSetsInfiniteData,
    ReturnType<typeof learningSetKeys.byUserPage>,
    number
  >({
    queryKey: learningSetKeys.byUserPage(userId, learningSetLimit),
    queryFn: ({ pageParam = 1 }) =>
      fetchLearningSetsByUserPaginated(userId, pageParam, learningSetLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });

  const updateLearningSetMutation = useMutation<
    LearningSet,
    AxiosError,
    UpdateVariables,
    MutationContext
  >({
    mutationKey: learningSetKeys.update(),
    mutationFn: ({ id, data }) => updateLearningSet(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: learningSetKeys.byUserPage(userId, learningSetLimit),
      });

      const previousLearningSets =
        queryClient.getQueryData<LearningSetsInfiniteData>(
          learningSetKeys.byUserPage(userId, learningSetLimit),
        );

      updateInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        { _id: id, ...data },
      );

      return { previousLearningSets };
    },
    onError: (_, __, context) => {
      if (context?.previousLearningSets) {
        queryClient.setQueryData(
          learningSetKeys.byUserPage(userId, learningSetLimit),
          context.previousLearningSets,
        );
      }
    },
    onSuccess: (updatedLearningSet) => {
      updateInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        updatedLearningSet,
      );

      queryClient.invalidateQueries({
        queryKey: learningSetKeys.byId(updatedLearningSet._id),
      });
    },
  });

  const deleteLearningSetMutation = useMutation<
    LearningSet,
    AxiosError,
    string,
    MutationContext
  >({
    mutationKey: learningSetKeys.delete(),
    mutationFn: (id) => deleteLearningSet(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: learningSetKeys.byUserPage(userId, learningSetLimit),
      });

      const previousLearningSets =
        queryClient.getQueryData<LearningSetsInfiniteData>(
          learningSetKeys.byUserPage(userId, learningSetLimit),
        );

      removeInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        id,
      );

      return { previousLearningSets };
    },
    onError: (_, __, context) => {
      if (context?.previousLearningSets) {
        queryClient.setQueryData<LearningSetsInfiniteData>(
          learningSetKeys.byUserPage(userId, learningSetLimit),
          context.previousLearningSets,
        );
      }
    },
    onSuccess: (deletedLearningSet) => {
      removeInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        deletedLearningSet._id,
      );

      queryClient.removeQueries({
        queryKey: learningSetKeys.byId(deletedLearningSet._id),
      });
    },
  });

  return {
    createLearningSetMutation,
    learningSetById,
    learningSetByUserPage,
    updateLearningSetMutation,
    deleteLearningSetMutation,
  };
};

export default useLearningSet;
