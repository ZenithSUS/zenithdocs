import GeneratedLearningCard from "@/components/dashboard/cards/learning-sets/GeneratedLearningCard";
import { AxiosError } from "@/types/api";
import { LearningItem } from "@/types/learning-set";
import { UserScore, UserScoreInput } from "@/types/user-score";
import { UseMutationResult } from "@tanstack/react-query";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import useStudyDocumentScreen from "../hooks/useStudyDocumentScreen";
import { UpdateVariables } from "@/features/user-score/useUserScore";

interface StudyDocumentProps {
  userId: string;
  learningSetId: string;
  userScoreId: string;
  learningType: "quiz" | "reviewer" | "flashcard" | "Unknown";
  learningItems: LearningItem[];
  isStudying: boolean;
  setIsStudying: React.Dispatch<React.SetStateAction<boolean>>;
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

export interface HandleSetPointsProps {
  points: number;
  itemId: string;
  answeredAt: Date;
  correct: boolean;
}

function StudyDocument({
  userId,
  learningSetId,
  userScoreId,
  learningType,
  learningItems,
  isStudying,
  setIsStudying,
  currentUserScore,
  createUserScoreMutation,
  updateUserScoreMutation,
}: StudyDocumentProps) {
  const {
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
  } = useStudyDocumentScreen({
    userId,
    learningSetId,
    userScoreId,
    learningItems,
    currentUserScore,
    createUserScoreMutation,
    updateUserScoreMutation,
  });

  if (items.length === 0)
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-semibold text-center text-primary tracking-wide font-serif uppercase">
            Please Wait
          </h2>
          <ThreeDot color="#c9a227" size="medium" />
        </div>
      </div>
    );

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <h1 className="text-2xl font-semibold text-center tracking-wide font-serif uppercase">
          RESULTS
        </h1>

        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-bold text-primary">{percentage}%</span>
          <span className="text-sm text-muted-foreground">
            {points} / {total} correct
          </span>
        </div>

        <div className="w-full max-w-xs h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground text-center">
          {percentage === 100
            ? "Perfect score!"
            : percentage >= 70
              ? "Great job! Keep it up."
              : "Keep studying, you'll get there!"}
        </p>

        <div className="flex flex-col gap-2 w-full">
          <button
            className="bg-primary w-full font-bold uppercase p-2 rounded-md"
            onClick={handleRestart}
          >
            Try Again
          </button>
          <button
            className="bg-white/8 w-full font-bold uppercase p-2 rounded-md border border-border hover:bg-white/12 transition-colors"
            onClick={() => setIsStudying(false)}
          >
            Back to Reviewer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header row with back button */}
      <div className="flex items-center gap-2">
        <button
          className="text-[11px] text-amber-300 bg-amber-400/10 p-1 rounded-md border border-amber-400 hover:text-text transition-colors flex items-center gap-1 shrink-0"
          onClick={() => setIsStudying(false)}
        >
          <ArrowLeft className="w-3 h-3" /> Reviewer
        </button>
        <h1 className="flex-1 text-xl text-primary font-semibold text-center tracking-wide font-serif uppercase truncate">
          {learningType}
        </h1>
        <button
          className="text-[11px] text-amber-300 bg-amber-400/10 tracking-wide p-1 rounded-md border border-amber-400 hover:text-primary transition-colors flex items-center gap-1 shrink-0"
          onClick={handleRestart}
        >
          <RotateCcw className="w-3 h-3" />
          Restart
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <GeneratedLearningCard
        key={currentIndex}
        learningItem={items[currentIndex]}
        isStudying={isStudying}
        setPoints={handleSetPoints}
      />

      {showNext && (
        <button className="btn btn-primary w-full" onClick={handleNext}>
          {currentIndex + 1 >= total ? "See Results" : "Next →"}
        </button>
      )}
    </div>
  );
}

export default StudyDocument;
