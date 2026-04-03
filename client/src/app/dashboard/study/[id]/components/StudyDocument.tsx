import GeneratedLearningCard from "@/components/dashboard/cards/learning-sets/GeneratedLearningCard";
import { LearningItem } from "@/types/learning-set";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThreeDot } from "react-loading-indicators";

interface StudyDocumentProps {
  learningType: "quiz" | "reviewer" | "flashcard" | "Unknown";
  learningItems: LearningItem[];
  isStudying: boolean;
  setIsStudying: React.Dispatch<React.SetStateAction<boolean>>;
}

function StudyDocument({
  learningType,
  learningItems,
  isStudying,
  setIsStudying,
}: StudyDocumentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [items, setItems] = useState<LearningItem[]>([]);
  const [finished, setFinished] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const hasAnswered = useRef(false);

  useEffect(() => {
    const shuffled = [...learningItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIndex(0);
    setPoints(0);
    setFinished(false);
    setShowNext(false);
    hasAnswered.current = false;
  }, [learningItems]);

  const handleSetPoints = (pts: number) => {
    if (hasAnswered.current) return;
    hasAnswered.current = true;
    setPoints((prev) => prev + pts);
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
    setCurrentIndex(0);
    setPoints(0);
    setFinished(false);
    setShowNext(false);
    hasAnswered.current = false;
  };

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

  const total = items.length;
  const percentage = Math.round((points / total) * 100);

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
