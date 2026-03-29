import { NavItem } from "../../Sidebar";
import SharedDocumentCard from "../../cards/SharedDocumentCard";
import SharedDocumentSkeletonCard from "../../skeleton/SharedDocumentSkeletonCard";
import PageControls from "./components/PageControls";
import SharedDocumentEmpty from "./components/SharedDocumentEmpty";
import SharedDocumentError from "./components/SharedDocumentError";
import useSharedTab from "./useSharedTab";

interface SharedTabProps {
  userId: string;
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
}

function SharedTab({ userId, setNav }: SharedTabProps) {
  const {
    // Data
    allSharedDocuments,
    totalPages,
    currentPage,
    sharedDocumentsLoading,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    sharedDocumentError,
    sharedDocumentErrorData,
    refetchSharedDocuments,
    isUpdatePending,

    // Actions
    handleToggleActive,
  } = useSharedTab(userId);

  if (sharedDocumentsLoading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <SharedDocumentSkeletonCard key={i} />
          ))}
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <SharedDocumentSkeletonCard key={i} />
          ))}
        </div> */}
      </div>
    );
  }

  if (sharedDocumentError) {
    return (
      <SharedDocumentError
        refetchSharedDocuments={refetchSharedDocuments}
        error={sharedDocumentErrorData}
      />
    );
  }

  if (allSharedDocuments.length === 0) {
    return <SharedDocumentEmpty setNav={setNav} />;
  }

  return (
    <div className="space-y-5">
      <h2>Your Shared Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {allSharedDocuments.map((sharedDocument) => (
          <SharedDocumentCard
            key={sharedDocument._id}
            sharedDocument={sharedDocument}
            onToggleActive={handleToggleActive}
            isTogglePending={isUpdatePending}
          />
        ))}
      </div>

      <PageControls
        totalPages={totalPages}
        page={currentPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
      />

      {/* <h2>Document Shared with you</h2> */}
    </div>
  );
}

export default SharedTab;
