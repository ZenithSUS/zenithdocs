import { LearningSet } from "@/types/learning-set";

interface StudyInfoPanelProps {
  learningSet: LearningSet | null | undefined;
  totalItems: number;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const TYPE_LABELS: Record<string, string> = {
  quiz: "Quiz",
  reviewer: "Reviewer",
  flashcard: "Flashcard",
};

function StudyInfoPanel({ learningSet, totalItems }: StudyInfoPanelProps) {
  if (!learningSet) return null;

  const difficulty = learningSet.difficulty ?? "easy";
  const type = learningSet.type ?? "quiz";
  const createdAt = new Date(learningSet.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="flex flex-col gap-5 md:sticky md:top-0 pb-2">
      {/* Title Card */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
          Learning Set
        </p>
        <h1 className="text-2xl font-bold text-text leading-tight mb-3">
          {learningSet.title ?? "Untitled"}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${DIFFICULTY_STYLES[difficulty]}`}
          >
            {difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent capitalize">
            {TYPE_LABELS[type] ?? type}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex flex-col gap-1">
          <p className="text-xs text-muted uppercase tracking-widest font-semibold">
            Items
          </p>
          <p className="text-3xl font-bold text-text">{totalItems}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex flex-col gap-1">
          <p className="text-xs text-muted uppercase tracking-widest font-semibold">
            Type
          </p>
          <p className="text-xl font-bold text-text capitalize">
            {TYPE_LABELS[type] ?? type}
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex flex-col gap-1 col-span-2">
          <p className="text-xs text-muted uppercase tracking-widest font-semibold">
            Created
          </p>
          <p className="text-sm font-medium text-text">{createdAt}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Item Breakdown
        </p>
        {(["mcq", "tf", "identification", "flashcard"] as const).map(
          (itemType) => {
            const count = learningSet.items.filter(
              (i) => i.type === itemType,
            ).length;
            const percent =
              totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
            if (count === 0) return null;
            return (
              <div key={itemType} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium capitalize text-text">
                    {itemType.toUpperCase()}
                  </span>
                  <span className="text-muted">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

export default StudyInfoPanel;
