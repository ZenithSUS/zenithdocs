import { AxiosError } from "@/types/api";
import { LearningItem } from "@/types/learning-set";
import { UserScore, UserScoreInput } from "@/types/user-score";
import { useCallback, useEffect, useRef, useState } from "react";
import { HandleSetPointsProps } from "../components/StudyDocument";
import { UseMutationResult } from "@tanstack/react-query";
import { handleApiError } from "@/helpers/api-error";
import { UpdateVariables } from "@/features/user-score/useUserScore";

interface UseStudyDocumentScreenProps {
  userId: string;
  learningSetId: string;
  userScoreId: string;
  learningItems: LearningItem[];
  currentUserScore: number;
  createUserScoreMutation: UseMutationResult<
    UserScore,
    AxiosError,
    UserScoreInput,
    unknown
  >;
  updateUserScoreMutation: UseMutationResult<
    UserScore,
    AxiosError,
    UpdateVariables,
    unknown
  >;
}

const useStudyDocumentScreen = ({
  userId,
  learningSetId,
  userScoreId,
  learningItems,
  currentUserScore,
  createUserScoreMutation,
  updateUserScoreMutation,
}: UseStudyDocumentScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [items, setItems] = useState<LearningItem[]>([]);
  const [finished, setFinished] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [history, setHistory] = useState<UserScore["history"]>([]);
  const hasAnswered = useRef(false);

  const total = items.length;
  const percentage = Math.round((points / total) * 100);

  useEffect(() => {
    const shuffled = [...learningItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIndex(0);
    setPoints(0);
    setFinished(false);
    setShowNext(false);
    hasAnswered.current = false;
  }, [learningItems]);

  useEffect(() => {
    if (finished) {
      handleRecordUserScore();
    }
  }, [finished]);

  const handleRecordUserScore = useCallback(async () => {
    if (createUserScoreMutation.isPending || updateUserScoreMutation.isPending)
      return;
    try {
      if (currentUserScore && userScoreId) {
        const data: Partial<UserScoreInput> = {
          userId: userId,
          learningSetId: learningSetId,
          history: history,
          score: points,
          total: items.length,
          correct: points,
        };
        await updateUserScoreMutation.mutateAsync({ id: userScoreId, data });
      } else {
        console.log("Creating user score");
        const data: UserScoreInput = {
          userId: userId,
          learningSetId: learningSetId,
          history: history,
          score: points,
          total: items.length,
          correct: points,
        };
        await createUserScoreMutation.mutateAsync(data);
      }
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error creating user score");
    }
  }, [
    points,
    userId,
    learningSetId,
    history,
    items.length,
    currentUserScore,
    createUserScoreMutation,
    updateUserScoreMutation,
  ]);

  const handleSetPoints = (answerInfo: HandleSetPointsProps) => {
    if (hasAnswered.current) return;
    hasAnswered.current = true;

    const { points, ...historyItem } = answerInfo;

    setPoints((prev) => prev + answerInfo.points);
    setHistory((prev) => [...prev, historyItem]);
    setShowNext(true);
  };

  const handleNext = () => {
    const next = currentIndex + 1;
    if (next >= items.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex(next);
    setShowNext(false);
    hasAnswered.current = false;
  };

  const handleRestart = () => {
    const shuffled = [...learningItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setHistory([]);
    setCurrentIndex(0);
    setPoints(0);
    setFinished(false);
    setShowNext(false);
    hasAnswered.current = false;
  };

  return {
    // States
    total,
    percentage,
    points,
    items,
    finished,
    currentIndex,
    showNext,

    // Handlers
    handleSetPoints,
    handleNext,
    handleRestart,
  };
};

export default useStudyDocumentScreen;
