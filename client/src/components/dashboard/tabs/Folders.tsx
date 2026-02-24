"use client";

import { useEffect, useRef, useState } from "react";
import { DocStatus } from "@/types/doc";
import { NavItem } from "@/components/dashboard/Sidebar";
import STATUS_META from "@/constants/status-meta";
import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";
import useFolder from "@/features/folder/useFolder";
import useDocument from "@/features/documents/useDocument";
import FolderCardSkeleton from "@/components/dashboard/skeleton/FolderCardSkeleton";
import { ThreeDot } from "react-loading-indicators";
import NewFolderModal from "../modals/NewFolderModal";
import FolderCard from "../cards/FolderCard";

interface FolderDashBoardProps {
  userId: string;
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  setFilterFolder: React.Dispatch<React.SetStateAction<string>>;
}

function FolderDashBoard({
  userId,
  setNav,
  setFilterFolder,
}: FolderDashBoardProps) {
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const { foldersByUserPage } = useFolder();
  const {
    data: foldersData,
    fetchNextPage: fetchNextFolderPage,
    hasNextPage: hasNextFolderPage,
    isFetchingNextPage: isFetchingNextFolderPage,
    isLoading: foldersLoading,
  } = foldersByUserPage(userId);

  const { documentsByUserPage } = useDocument(userId);
  const { data: documentsData, isLoading: documentsLoading } =
    documentsByUserPage;

  // Intersection observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextFolderPage || isFetchingNextFolderPage)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextFolderPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextFolderPage, isFetchingNextFolderPage, fetchNextFolderPage]);

  // Flatten all pages
  const allFolders = foldersData?.pages.flatMap((page) => page.folders) || [];
  const allDocuments =
    documentsData?.pages.flatMap((page) => page.documents) || [];

  // Helper to get documents for a specific folder
  const getDocsForFolder = (folderFilter: string) => {
    return allDocuments.filter((d) => {
      const folderId =
        typeof d.folder === "object"
          ? d.folder?._id
          : typeof d.folder === "string"
            ? d.folder
            : null;

      return folderId === folderFilter;
    });
  };

  // Helper to get unfiled documents
  const unfiledDocs = allDocuments.filter((d) => !d.folder);

  // Loading state
  if (foldersLoading || documentsLoading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <FolderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (allFolders.length === 0 && unfiledDocs.length === 0) {
    return (
      <div className="border border-white/8 rounded-sm px-8 py-16 text-center">
        <div className="text-[48px] text-text/10 mb-4">⬡</div>
        <h3 className="text-[18px] font-serif text-text/60 mb-2">
          No folders yet
        </h3>
        <p className="text-[13px] text-text/30 font-sans max-w-sm mx-auto mb-6">
          Create folders to organize your documents by project, client, or
          topic.
        </p>
        <button className="px-6 py-3 bg-primary text-background text-[12px] font-bold tracking-[0.12em] font-sans rounded-sm transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5">
          CREATE FOLDER
        </button>
      </div>
    );
  }

  const handleFolderClick = (folderId: string) => {
    setFilterFolder(folderId);
    setNav("documents");
  };

  return (
    <div className="space-y-5">
      {/* Modals */}
      <NewFolderModal
        userId={userId}
        open={newFolderOpen}
        setOpen={setNewFolderOpen}
      />

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
        <div
          className="border border-dashed border-white/10 rounded-sm px-6 py-6 flex flex-col items-center justify-center gap-3 hover:border-primary/20 hover:bg-primary/3 transition-all duration-200 cursor-pointer min-h-45"
          onClick={() => setNewFolderOpen(true)}
        >
          <span className="text-[28px] text-text/15">+</span>
          <span className="text-[12px] text-text/25 font-sans tracking-wider">
            NEW FOLDER
          </span>
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
              <ThreeDot
                color="#c9a227"
                size="small"
                text="Loading more folders..."
                textColor=""
              />
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
              const sm = STATUS_META[doc.status];
              return (
                <div
                  key={doc._id}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/3 transition-colors cursor-pointer"
                  onClick={() => setNav("documents")}
                >
                  <FileIcon type={doc.fileType} />
                  <span className="flex-1 text-[13px] font-sans text-text/70 truncate">
                    {doc.title}
                  </span>
                  <span
                    className={`text-[11px] font-sans ${sm.text} flex items-center gap-1.5`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                    {sm.label}
                  </span>
                </div>
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

export default FolderDashBoard;
