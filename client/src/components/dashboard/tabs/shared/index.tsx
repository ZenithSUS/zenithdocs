import { NavItem } from "../../Sidebar";
import SharedDocumentCard from "../../cards/SharedDocumentCard";
import PageControls from "./components/PageControls";
import SharedDocumentEmpty from "./components/SharedDocumentEmpty";
import FetchError from "../../FetchError";
import SharedDocumentLoading from "./components/SharedDocumentLoading";
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
    return <SharedDocumentLoading />;
  }

  if (sharedDocumentError) {
    return (
      <FetchError
        errorTitleMessage="Unable to get shared documents"
        refetch={refetchSharedDocuments}
        error={sharedDocumentErrorData}
      />
    );
  }

  if (allSharedDocuments.length === 0) {
    return <SharedDocumentEmpty setNav={setNav} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[24px] font-serif text-text/90">
          Shared Documents
        </h2>

        <p className="text-[12px] text-text/50 font-sans">
          {allSharedDocuments.length}{" "}
          {allSharedDocuments.length === 1 ? "Document" : "Documents"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {allSharedDocuments.map((sharedDocument) => (
          <SharedDocumentCard
            key={sharedDocument._id}
            userId={userId}
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
    </div>
  );
}

export default SharedTab;
