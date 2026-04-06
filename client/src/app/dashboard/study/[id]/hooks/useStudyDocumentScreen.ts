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
  const [restartCount, setRestartCount] = useState(0);

  const hasAnswered = useRef(false);
  const hasRecorded = useRef(false);

  const pointsRef = useRef(points);
  const historyRef = useRef(history);
  const itemsLengthRef = useRef(items.length);
  const currentUserScoreRef = useRef(currentUserScore);
  const userScoreIdRef = useRef(userScoreId);
  const userIdRef = useRef(userId);
  const learningSetIdRef = useRef(learningSetId);
  const createMutationRef = useRef(createUserScoreMutation);
  const updateMutationRef = useRef(updateUserScoreMutation);

  pointsRef.current = points;
  historyRef.current = history;
  itemsLengthRef.current = items.length;
  currentUserScoreRef.current = currentUserScore;
  userScoreIdRef.current = userScoreId;
  userIdRef.current = userId;
  learningSetIdRef.current = learningSetId;
  createMutationRef.current = createUserScoreMutation;
  updateMutationRef.current = updateUserScoreMutation;

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

  const handleRecordUserScore = useCallback(async () => {
    if (hasRecorded.current) return;
    if (
      createMutationRef.current.isPending ||
      updateMutationRef.current.isPending
    )
      return;

    hasRecorded.current = true;

    try {
      const latestPoints = pointsRef.current;

      if (currentUserScoreRef.current && userScoreIdRef.current) {
        const data: Partial<UserScoreInput> = {
          userId: userIdRef.current,
          learningSetId: learningSetIdRef.current,
          history: historyRef.current,
          score: latestPoints,
          total: itemsLengthRef.current,
          correct: latestPoints,
        };
        await updateMutationRef.current.mutateAsync({
          id: userScoreIdRef.current,
          data,
        });
      } else {
        const data: UserScoreInput = {
          userId: userIdRef.current,
          learningSetId: learningSetIdRef.current,
          history: historyRef.current,
          score: latestPoints,
          total: itemsLengthRef.current,
          correct: latestPoints,
        };
        await createMutationRef.current.mutateAsync(data);
      }
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Error creating user score");
    }
  }, []);

  useEffect(() => {
    if (finished) {
      handleRecordUserScore();
    }
  }, [finished, handleRecordUserScore]);

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
    hasRecorded.current = false;
    setRestartCount((prev) => prev + 1);
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
    restartCount,

    // Handlers
    handleSetPoints,
    handleNext,
    handleRestart,
  };
};

export default useStudyDocumentScreen;
