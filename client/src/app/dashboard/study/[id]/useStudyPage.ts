"use client";

import { useState } from "react";
import { useAuthMe } from "@/features/auth/useAuthMe";
import { useLearningSetById } from "@/features/learning-sets/useLearningSetById";
import useRetryStore from "@/store/useRetryStore";
import { useParams } from "next/navigation";
import { useUserScoreByUserAndLearningSet } from "@/features/user-score/useUserScoreByUserAndLearningSet";
import useUserScore from "@/features/user-score/useUserScore";

const useStudyPage = () => {
  const params = useParams();
  const learningSetId = params?.id as string;

  const [isStudying, setIsStudying] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false);

  const { increment, retries } = useRetryStore();
  const pageRetry = retries["learning-set-page"] ?? 0;

  const {
    data: me,
    isLoading: isLoadingMe,
    isError: isErrorMe,
    error: errorMe,
    refetch: refetchMe,
  } = useAuthMe();

  const {
    data: learningSet,
    isLoading: isLoadingLearningSet,
    error: errorLearningSet,
    isError: isErrorLearningSet,
    refetch: refetchLearningSet,
  } = useLearningSetById(learningSetId);

  const {
    data: userScore,
    isLoading: isLoadingUserScore,
    error: errorUserScore,
    isError: isErrorUserScore,
    refetch: refetchUserScore,
  } = useUserScoreByUserAndLearningSet(me?._id ?? "", learningSetId);

  const { createUserScoreMutation, updateUserScoreMutation } = useUserScore(
    me?._id ?? "",
    learningSetId,
  );

  const retryUser = () => {
    increment("learning-set-page");
    refetchMe().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("learning-set-page");
      }
    });
  };

  const retryLearningSet = () => {
    increment("learning-set-page");
    refetchLearningSet().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("learning-set-page");
      }
    });
  };

  const retryUserScore = () => {
    increment("learning-set-page");
    refetchUserScore().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("learning-set-page");
      }
    });
  };

  return {
    // Retry Functions
    pageRetry,
    retryUser,
    retryLearningSet,
    retryUserScore,

    // Users
    me,
    isLoadingMe,
    isErrorMe,
    errorMe,

    // Learning Sets
    learningSet,
    isLoadingLearningSet,
    isErrorLearningSet,
    errorLearningSet,

    // User Scores
    userScore,
    isLoadingUserScore,
    isErrorUserScore,
    errorUserScore,

    // Mutations
    createUserScoreMutation,
    updateUserScoreMutation,

    // UI
    isStudying,
    setIsStudying,
    chatBotOpen,
    setChatBotOpen,
  };
};

export default useStudyPage;
