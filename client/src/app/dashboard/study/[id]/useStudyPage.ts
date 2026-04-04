"use client";

import { useState } from "react";
import { useAuthMe } from "@/features/auth/useAuthMe";
import { useLearningSetById } from "@/features/learning-sets/useLearningSetById";
import useRetryStore from "@/store/useRetryStore";
import { useParams } from "next/navigation";

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

  return {
    // Retry Functions
    pageRetry,
    retryUser,
    retryLearningSet,

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

    // UI
    isStudying,
    setIsStudying,
    chatBotOpen,
    setChatBotOpen,
  };
};

export default useStudyPage;
