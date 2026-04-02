"use client";

import LoadingScreen from "@/components/LoadingScreen";
import useStudy from "./useStudyPage";
import ErrorScreen from "@/components/ErrorScreen";
import Header from "@/components/dashboard/Header";
import StudyItems from "./components/StudyItems";
import StudyInfoPanel from "./components/StudyInfoPanel";

function StudyPage() {
  const {
    pageRetry,
    retryUser,
    retryLearningSet,
    me,
    isLoadingMe,
    isErrorMe,
    errorMe,
    learningSet,
    isLoadingLearningSet,
    isErrorLearningSet,
    errorLearningSet,
  } = useStudy();

  if (isLoadingMe || isLoadingLearningSet) return <LoadingScreen />;

  if (isErrorMe) {
    return (
      <ErrorScreen
        error={errorMe}
        onRetry={retryUser}
        retries={pageRetry}
        messageErrorTitle="User Error"
      />
    );
  }

  if (isErrorLearningSet) {
    return (
      <ErrorScreen
        error={errorLearningSet}
        onRetry={retryLearningSet}
        retries={pageRetry}
        messageErrorTitle="Learning Set Error"
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-text relative">
      <Header
        user={me}
        title="STUDY"
        titleHighlight={learningSet?.title ?? "Untitled"}
      />

      <main className="mt-18.25 h-[calc(100vh-73px)] overflow-y-auto px-5 sm:px-8 md:px-12 pt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <StudyInfoPanel
            learningSet={learningSet}
            totalItems={learningSet?.items?.length ?? 0}
          />

          <StudyItems learningItems={learningSet?.items ?? []} />
        </div>
      </main>
    </div>
  );
}

export default StudyPage;
