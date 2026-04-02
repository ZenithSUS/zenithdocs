import { useLearningSetByUserPage } from "@/features/learning-sets/useLearningSetByUserPage";
import { useState } from "react";

const useStudyTab = (userId: string) => {
  const [page, setPage] = useState(1);

  const {
    data: learningSets,
    isLoading: isLearningSetsLoading,
    isError: isLearningSetsError,
    error: learningSetsError,
    refetch: refetchLearningSets,
  } = useLearningSetByUserPage(userId, page);

  const allLearningSets = learningSets?.learningSets ?? [];
  const totalPages = learningSets?.pagination.totalPages ?? 0;
  const currentPage = learningSets?.pagination.page ?? 1;

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const fetchNextPage = () => {
    if (hasNextPage) setPage((prev) => prev + 1);
  };

  const fetchPreviousPage = () => {
    if (hasPreviousPage) setPage((prev) => prev - 1);
  };

  return {
    // learning sets
    allLearningSets,
    totalPages,
    currentPage,
    isLearningSetsLoading,
    isLearningSetsError,
    learningSetsError,
    refetchLearningSets,
    hasNextLearningSetPage: hasNextPage,
    hasPreviousLearningSetPage: hasPreviousPage,
    fetchNextLearningSetPage: fetchNextPage,
    fetchPreviousLearningSetPage: fetchPreviousPage,
  };
};

export default useStudyTab;
