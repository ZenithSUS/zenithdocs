"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Doc from "@/types/doc";
import sizefmt from "@/helpers/size-format";
import { Folder } from "@/types/folder";
import { SUMMARY_ICONS } from "@/components/dashboard/tabs/Summary";
import FileIcon from "@/components/FileIcon";
import STATUS_META from "@/constants/status-meta";
import useDocument from "@/features/documents/useDocument";
import useFolder from "@/features/folder/useFolder";
import useSummary from "@/features/summary/useSummary";
import DocumentCardSkeleton from "@/components/dashboard/skeleton/DocumentCardSkeleton";
import DeleteDocumentModal from "@/components/dashboard/modals/document/DeleteDocumentModal";
import MoveToFolderModal from "@/components/dashboard/modals/document/MoveToFolderModal";
import { ThreeDot } from "react-loading-indicators";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  FolderPlus,
  MoreHorizontal,
  SparkleIcon,
  TrashIcon,
} from "lucide-react";

interface DocumentsTabProps {
  userId: string;
  filterFolder: string;
  setFilterFolder: React.Dispatch<React.SetStateAction<string>>;
}

function DocumentsTab({
  userId,
  filterFolder,
  setFilterFolder,
}: DocumentsTabProps) {
  const router = useRouter();

  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [documentToMove, setDocumentToMove] = useState<{
    id: string;
    title: string;
    folderId?: string | null;
  } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState<Doc["status"] | "all">(
    "all",
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const actionsButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // Check if click is inside any actions button or the dropdown menu
      const clickedInsideButton = Array.from(
        actionsButtonRefs.current.values(),
      ).some((button) => button && button.contains(target));

      const dropdownMenu = document.getElementById("actions-dropdown-menu");
      const clickedInsideDropdown =
        dropdownMenu && dropdownMenu.contains(target);

      if (!clickedInsideButton && !clickedInsideDropdown) {
        setActionsMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown position when menu opens
  useEffect(() => {
    if (actionsMenuOpen && actionsButtonRefs.current.has(actionsMenuOpen)) {
      const button = actionsButtonRefs.current.get(actionsMenuOpen);
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 192, // 192px = w-48
        });
      }
    } else {
      setDropdownPosition(null);
    }
  }, [actionsMenuOpen]);

  // Fetch documents with pagination
  const { documentsByUserPage } = useDocument(userId, "");
  const {
    data: documentsData,
    isLoading: documentsLoading,
    fetchNextPage: fetchNextDocPage,
    hasNextPage: hasNextDocPage,
    isFetchingNextPage: isFetchingNextDocPage,
  } = documentsByUserPage;

  // Fetch folders for dropdown
  const { foldersByUserPage } = useFolder();
  const { data: foldersData, isLoading: foldersLoading } =
    foldersByUserPage(userId);

  // Fetch summaries for expanded view
  const { summariesByUserPage } = useSummary(userId);
  const { data: summariesData } = summariesByUserPage;

  // Flatten paginated data
  const allDocs = documentsData?.pages.flatMap((page) => page.documents) ?? [];
  const allFolders = foldersData?.pages.flatMap((page) => page.folders) ?? [];
  const allSummaries =
    summariesData?.pages.flatMap((page) => page.summaries) ?? [];

  // Client-side filtering
  const filteredDocs = allDocs.filter((doc) => {
    const docFolderId =
      typeof doc.folder === "object"
        ? doc.folder?._id
        : typeof doc.folder === "string"
          ? doc.folder
          : undefined;

    if (filterFolder !== "all") {
      if (filterFolder === "") {
        if (docFolderId) return false;
      } else {
        if (docFolderId !== filterFolder) return false;
      }
    }

    if (filterStatus !== "all" && doc.status !== filterStatus) {
      return false;
    }

    return true;
  });

  // Handle delete click
  const handleDeleteClick = (docId: string, docTitle: string) => {
    setDocumentToDelete({ id: docId, title: docTitle });
    setDeleteModalOpen(true);
    setActionsMenuOpen(null);
  };

  // Handle move click
  const handleMoveClick = (
    docId: string,
    docTitle: string,
    folderId?: string | null,
  ) => {
    setDocumentToMove({ id: docId, title: docTitle, folderId });
    setMoveModalOpen(true);
    setActionsMenuOpen(null);
  };

  // Handle successful deletion
  const handleDeleteSuccess = () => {
    if (selectedDoc?._id === documentToDelete?.id) {
      setSelectedDoc(null);
    }
    setDocumentToDelete(null);
  };

  // Handle successful move
  const handleMoveSuccess = () => {
    setDocumentToMove(null);
  };

  // Handle navigation with blocking
  const handleNavigate = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setActionsMenuOpen(null);
    router.push(path);
    setTimeout(() => setIsNavigating(false), 1000);
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextDocPage || isFetchingNextDocPage)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextDocPage();
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
  }, [hasNextDocPage, isFetchingNextDocPage, fetchNextDocPage]);

  // Loading state
  if (documentsLoading || foldersLoading) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-64 h-9 bg-white/6 rounded-sm animate-pulse" />
          <div className="w-32 h-9 bg-white/6 rounded-sm animate-pulse" />
          <div className="ml-auto w-24 h-4 bg-white/6 rounded-sm animate-pulse" />
        </div>
        <div className="border border-white/8 rounded-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/6 bg-white/2">
            {["TYPE", "DOCUMENT", "SIZE", "STATUS", "DATE", ""].map((h) => (
              <span
                key={h}
                className="text-[9px] tracking-[0.18em] text-text/25 font-sans"
              >
                {h}
              </span>
            ))}
          </div>
          <div className="divide-y divide-white/4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <DocumentCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (allDocs.length === 0) {
    return (
      <div className="border border-white/8 rounded-sm px-8 py-16 text-center">
        <div className="text-[48px] text-text/10 mb-4">▣</div>
        <h3 className="text-[18px] font-serif text-text/60 mb-2">
          No documents yet
        </h3>
        <p className="text-[13px] text-text/30 font-sans max-w-sm mx-auto mb-6">
          Upload your first document to start generating AI-powered summaries
          and insights.
        </p>
        <button
          type="button"
          className="px-6 py-3 bg-primary text-background text-[12px] font-bold tracking-[0.12em] font-sans rounded-sm transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5 cursor-pointer"
          onClick={() => router.replace("/dashboard/upload")}
        >
          UPLOAD DOCUMENT
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 p-1 bg-white/4 border border-white/8 rounded-sm">
          {(
            ["all", "uploaded", "processing", "completed", "failed"] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilterStatus(s);
                setSelectedDoc(null);
              }}
              className={`px-3 py-1.5 text-[10px] tracking-[0.08em] font-sans rounded-sm transition-all duration-150 capitalize ${
                filterStatus === s
                  ? "bg-primary text-background font-bold"
                  : "text-text/45 hover:text-text/70"
              }`}
            >
              {s === "all" ? "ALL" : STATUS_META[s].label.toUpperCase()}
            </button>
          ))}
        </div>

        <select
          value={filterFolder}
          onChange={(e) => {
            setFilterFolder(e.target.value);
            setSelectedDoc(null);
          }}
          className="px-3 py-2 bg-white/4 border border-white/8 rounded-sm text-[11px] font-sans text-text/60 outline-none hover:border-primary/30 transition-colors cursor-pointer"
        >
          <option value="all">All Folders</option>
          {allFolders.map((f: Folder) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
          <option value="">No Folder</option>
        </select>

        {(filterStatus !== "all" || filterFolder !== "all") && (
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterFolder("all");
              setSelectedDoc(null);
            }}
            className="px-3 py-2 text-[11px] text-text/40 font-sans hover:text-primary transition-colors duration-200"
          >
            Clear filters
          </button>
        )}

        <span className="text-[11px] text-text/25 font-sans ml-auto">
          {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Document table */}
      <div className="border border-white/8 rounded-sm overflow-visible">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/6 bg-white/2">
          {["TYPE", "DOCUMENT", "SIZE", "STATUS", "DATE", ""].map((h) => (
            <span
              key={h}
              className="text-[9px] tracking-[0.18em] text-text/25 font-sans"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Document rows */}
        <div className="divide-y divide-white/4">
          {filteredDocs.length === 0 ? (
            <div className="px-5 py-12 text-center text-text/25 text-[13px] font-sans">
              No documents match the current filters.
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterFolder("all");
                }}
                className="block mx-auto mt-3 text-primary hover:text-[#e0b530] transition-colors text-[12px]"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const sm = STATUS_META[doc.status];
              const folder =
                typeof doc.folder === "object"
                  ? doc.folder
                  : allFolders.find((f) => f._id === doc.folder);
              const isSelected = selectedDoc?._id === doc._id;
              const isActionsOpen = actionsMenuOpen === doc._id;

              return (
                <div
                  key={doc._id}
                  className={`grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : "hover:bg-white/3"
                  }`}
                >
                  <div
                    className="flex items-center gap-3 sm:contents cursor-pointer"
                    onClick={() => setSelectedDoc(isSelected ? null : doc)}
                  >
                    <FileIcon type={doc.fileType} />

                    <div className="sm:col-start-2 min-w-0">
                      <div className="text-[13px] font-sans text-text/80 truncate">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-text/30 font-sans mt-0.5 sm:hidden">
                        {folder?.name ?? "No folder"} ·{" "}
                        {sizefmt.bytes(doc.fileSize)}
                      </div>
                      <div className="text-[11px] text-text/30 font-sans mt-0.5 hidden sm:block">
                        {folder?.name ?? "No folder"}
                      </div>
                    </div>

                    <span className="text-[12px] text-text/35 font-sans my-auto hidden sm:block">
                      {sizefmt.bytes(doc.fileSize)}
                    </span>

                    <div
                      className={`flex items-center gap-1.5 text-[11px] font-sans ${sm.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${
                          doc.status === "processing" ? "animate-pulse" : ""
                        }`}
                      />
                      <span className="hidden sm:inline">{sm.label}</span>
                    </div>

                    <span className="text-[11px] text-text/25 text-right my-auto font-sans hidden sm:block">
                      {sizefmt.date(doc.createdAt)}
                    </span>
                  </div>

                  {/* Actions button */}
                  <div className="sm:col-start-6 flex justify-end">
                    <button
                      ref={(el) => {
                        if (el) {
                          actionsButtonRefs.current.set(doc._id, el);
                        } else {
                          actionsButtonRefs.current.delete(doc._id);
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionsMenuOpen(isActionsOpen ? null : doc._id);
                      }}
                      className="p-2 text-text/30 hover:text-text/70 transition-colors disabled:opacity-50"
                      disabled={isNavigating}
                    >
                      <MoreHorizontal />
                    </button>
                  </div>

                  {/* Expanded summary panel */}
                  {isSelected && (
                    <div className="col-span-full mt-3 pt-3 border-t border-primary/10">
                      {(() => {
                        const summary = allSummaries.find((s) => {
                          const summaryDocId =
                            s.document && typeof s.document === "object"
                              ? s.document._id
                              : typeof s.document === "string"
                                ? s.document
                                : null;
                          return summaryDocId === doc._id;
                        });

                        return summary ? (
                          <div className="px-4 py-4 bg-primary/5 border border-primary/12 rounded-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-primary text-[13px]">
                                {SUMMARY_ICONS[summary.type]}
                              </span>
                              <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
                                {summary.type.toUpperCase()} SUMMARY
                              </span>
                              <span className="ml-auto text-[10px] text-text/25 font-sans">
                                {summary.tokensUsed} tokens
                              </span>
                            </div>
                            <p className="text-[13px] text-text/65 font-sans leading-[1.7] whitespace-pre-line">
                              {summary.content}
                            </p>
                          </div>
                        ) : (
                          <div className="text-[12px] text-text/30 font-sans flex items-center gap-2">
                            <span className="text-text/20">◎</span>
                            {doc.status === "processing"
                              ? "Processing — summary will appear when complete."
                              : doc.status === "failed"
                                ? "Processing failed. Please re-upload the document."
                                : doc.status === "uploaded"
                                  ? "Document queued. Processing will begin shortly."
                                  : "No summary generated yet."}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Actions dropdown menu - rendered via Portal */}
      {actionsMenuOpen &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="actions-dropdown-menu"
            style={{
              position: "absolute",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
            className="w-48 bg-[#1a1a1a] border border-white/12 rounded-sm shadow-xl z-9999 overflow-hidden"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate(`/dashboard/document/${actionsMenuOpen}`);
              }}
              disabled={isNavigating}
              className="w-full px-4 py-2.5 text-left text-[12px] font-sans text-text/70 hover:bg-white/5 hover:text-text transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                <EyeIcon className="w-4 h-4" />
              </span>{" "}
              View Document
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate(`/dashboard/summarize?doc=${actionsMenuOpen}`);
              }}
              disabled={isNavigating}
              className="w-full px-4 py-2.5 text-left text-[12px] font-sans text-text/70 hover:bg-white/5 hover:text-text transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                <SparkleIcon className="w-4 h-4" />
              </span>{" "}
              Summarize
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const doc = filteredDocs.find((d) => d._id === actionsMenuOpen);
                if (doc) {
                  const folderId =
                    typeof doc.folder === "object"
                      ? doc.folder?._id
                      : doc.folder;
                  handleMoveClick(doc._id, doc.title, folderId);
                }
              }}
              className="w-full px-4 py-2.5 text-left text-[12px] font-sans text-text/70 hover:bg-white/5 hover:text-text transition-colors flex items-center gap-2"
            >
              <span>
                <FolderPlus className="w-4 h-4" />
              </span>{" "}
              Move to Folder
            </button>
            <div className="border-t border-white/8" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                const doc = filteredDocs.find((d) => d._id === actionsMenuOpen);
                if (doc) {
                  handleDeleteClick(doc._id, doc.title);
                }
              }}
              disabled={isNavigating}
              className="w-full px-4 py-2.5 text-left text-[12px] font-sans text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                <TrashIcon className="w-4 h-4" />
              </span>{" "}
              Delete
            </button>
          </div>,
          document.body,
        )}

      {/* Load more */}
      {hasNextDocPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextDocPage ? (
            <div className="flex items-center gap-2 text-[12px] text-text/40 font-sans">
              <ThreeDot
                color="#c9a227"
                size="small"
                text="Loading more documents..."
                textColor=""
              />
            </div>
          ) : (
            <button
              onClick={() => fetchNextDocPage()}
              className="px-6 py-2.5 border border-white/10 text-text/50 rounded-sm text-[11px] tracking-widest font-sans transition-all duration-200 hover:border-primary/30 hover:text-text/70"
            >
              LOAD MORE
            </button>
          )}
        </div>
      )}

      {!hasNextDocPage && filteredDocs.length > 0 && (
        <div className="text-center py-6 text-[11px] text-text/20 font-sans tracking-wider">
          — END OF DOCUMENTS —
        </div>
      )}

      {/* Delete Modal */}
      {documentToDelete && (
        <DeleteDocumentModal
          documentId={documentToDelete.id}
          documentTitle={documentToDelete.title}
          userId={userId}
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {/* Move to Folder Modal */}
      {documentToMove && (
        <MoveToFolderModal
          documentId={documentToMove.id}
          documentTitle={documentToMove.title}
          currentFolderId={documentToMove.folderId}
          userId={userId}
          open={moveModalOpen}
          onOpenChange={setMoveModalOpen}
          onSuccess={handleMoveSuccess}
        />
      )}
    </div>
  );
}

export default DocumentsTab;
