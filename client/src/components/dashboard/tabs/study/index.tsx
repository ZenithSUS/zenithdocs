import LearningSetCard from "./components/LearningSetCard";
import LearningSetError from "./components/LearningSetError";
import LearningSetSkeletion from "./components/LearningSetSkeleton";
import PageControls from "./components/PageControls";
import useStudyTab from "./useStudyTab";

interface StudyTabProps {
  userId: string;
}

function StudyTab({ userId }: StudyTabProps) {
  const {
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
  } = useStudyTab(userId);

  if (isLearningSetsLoading) {
    return <LearningSetSkeletion />;
  }

  if (isLearningSetsError) {
    return (
      <LearningSetError
        refetchLearningSets={refetchLearningSets}
        error={learningSetsError}
      />
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[18px] font-bold tracking-wide font-serif">STUDY</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {allLearningSets.map((learningSet) => (
          <LearningSetCard
            key={learningSet._id}
            learningSet={learningSet}
            userId={userId}
            page={currentPage}
          />
        ))}
      </div>

      <PageControls
        totalPages={totalPages}
        page={currentPage}
        isLoading={isLearningSetsLoading}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
      />
    </div>
  );
}

export default StudyTab;
