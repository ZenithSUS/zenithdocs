import LearningSetCard from "./components/LearningSetCard";
import useStudyTab from "./useStudyTab";

interface StudyTabProps {
  userId: string;
}

function StudyTab({ userId }: StudyTabProps) {
  const {
    allLearningSets,
    hasNextLearningSetPage,
    fetchNextLearningSetPage,
    isLearningSetsLoading,
    isLearningSetsError,
    learningSetsError,
    refetchLearningSets,
  } = useStudyTab(userId);

  return (
    <div className="space-y-5">
      <h2 className="text-[18px] font-bold tracking-wide font-serif">STUDY</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allLearningSets.map((learningSet) => (
          <LearningSetCard key={learningSet._id} learningSet={learningSet} />
        ))}
      </div>
    </div>
  );
}

export default StudyTab;
