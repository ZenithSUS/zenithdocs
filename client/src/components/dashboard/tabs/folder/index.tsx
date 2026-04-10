"use client";

import { ThreeDot } from "react-loading-indicators";
import { NavItem } from "@/components/dashboard/Sidebar";
import NewFolderModal from "@/components/dashboard/modals/folder/NewFolderModal";
import FolderCard from "@/components/dashboard/cards/FolderCard";
import FolderLoadingSkeletion from "@/components/dashboard/tabs/folder/components/FolderLoadingSkeletion";
import UnifiedDocumentsCard from "@/components/dashboard/tabs/folder/components/UnifiedDocumentsCard";
import NoFolderCard from "@/components/dashboard/tabs/folder/components/NoFolderCard";
import useFolderTab from "@/components/dashboard/tabs/folder/useFolderTab";
import FetchError from "../../FetchError";

interface FolderTabProps {
  userId: string;
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  setFilterFolder: React.Dispatch<React.SetStateAction<string>>;
  onRefresh?: (scope: "all" | "overview" | "user") => void;
}

function FolderTab({
  userId,
  setNav,
  setFilterFolder,
  onRefresh,
}: FolderTabProps) {
  const {
    // Loading states
    foldersLoading,
    documentsLoading,

    // Data
    allFolders,
    unfiledDocs,

    // States
    hasNextFolderPage,
    isFetchingNextFolderPage,

    // Errors
    isFolderTabError,
    foldersTabError,

    // Refetch
    refetchFoldersAndDocuments,

    // Actions
    getDocsForFolder,
    fetchNextFolderPage,

    // Ref
    loadMoreRef,
  } = useFolderTab(userId);

  const handleFolderClick = (folderId: string) => {
    setFilterFolder(folderId);
    setNav("documents");
  };

  if (foldersLoading || documentsLoading) {
    return <FolderLoadingSkeletion />;
  }

  if (isFolderTabError) {
    return (
      <FetchError
        errorTitleMessage="Unable to get folders"
        refetch={refetchFoldersAndDocuments}
        error={foldersTabError}
      />
    );
  }

  if (allFolders.length === 0 && unfiledDocs.length === 0) {
    return <NoFolderCard userId={userId} onRefresh={onRefresh || (() => {})} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allFolders.map((folder) => {
          const docs = getDocsForFolder(folder._id);

          return (
            <FolderCard
              key={folder._id}
              folder={folder}
              docs={docs}
              handleFolderClick={handleFolderClick}
            />
          );
        })}

        {/* New folder CTA */}
        <div className="border border-dashed border-white/10 rounded-sm px-6 py-6 flex flex-col items-center justify-center gap-3 hover:border-primary/20 hover:bg-primary/3 transition-all duration-200 cursor-pointer min-h-45">
          <div className="text-[48px] text-text/10">⬡</div>

          <NewFolderModal
            userId={userId}
            text="NEW FOLDER"
            onRefresh={onRefresh}
          />
        </div>
      </div>

      {/* Load more folders trigger */}
      {hasNextFolderPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-6"
        >
          {isFetchingNextFolderPage ? (
            <div className="flex items-center gap-2 text-[12px] text-text/40 font-sans">
              <p className="text-[12px] text-primary font-sans tracking-widest">
                Loading more folders
              </p>
              <ThreeDot color="#c9a227" size="small" />
            </div>
          ) : (
            <button
              onClick={() => fetchNextFolderPage()}
              className="px-6 py-2.5 border border-white/10 text-text/50 rounded-sm text-[11px] tracking-widest font-sans transition-all duration-200 hover:border-primary/30 hover:text-text/70"
            >
              LOAD MORE FOLDERS
            </button>
          )}
        </div>
      )}

      {/* Unfiled documents section */}
      {unfiledDocs.length > 0 && (
        <div className="border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/6 bg-white/2 flex items-center gap-2">
            <span className="text-[11px] tracking-[0.15em] text-text/40 font-sans">
              UNFILED DOCUMENTS
            </span>
            <span className="ml-auto text-[10px] text-text/20 font-sans">
              {unfiledDocs.length}
            </span>
          </div>
          <div className="divide-y divide-white/4">
            {unfiledDocs.slice(0, 5).map((doc) => {
              return (
                <UnifiedDocumentsCard
                  key={doc._id}
                  document={doc}
                  setNav={setNav}
                />
              );
            })}
            {unfiledDocs.length > 5 && (
              <div
                className="px-5 py-3 text-center text-[11px] text-primary/70 font-sans hover:text-primary transition-colors cursor-pointer"
                onClick={() => setNav("documents")}
              >
                View all {unfiledDocs.length} unfiled documents →
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderTab;
