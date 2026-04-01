import { useLearningSetByUserPage } from "@/features/learning-sets/useLearningSetByUserPage";

const useStudyTab = (userId: string) => {
  const {
    data: learningSets,
    fetchNextPage: fetchNextLearningSetPage,
    hasNextPage: hasNextLearningSetPage,
    isLoading: isLearningSetsLoading,
    isError: isLearningSetsError,
    error: learningSetsError,
    refetch: refetchLearningSets,
  } = useLearningSetByUserPage(userId);

  const allLearningSets =
    learningSets?.pages.flatMap((page) => page.learningSets) ?? [];

  return {
    // learning sets
    allLearningSets,
    hasNextLearningSetPage,
    fetchNextLearningSetPage,
    isLearningSetsLoading,
    isLearningSetsError,
    learningSetsError,
    refetchLearningSets,
  };
};

export default useStudyTab;
