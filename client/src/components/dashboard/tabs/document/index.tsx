"use client";

import { createPortal } from "react-dom";
import { ThreeDot } from "react-loading-indicators";
import { Folder } from "@/types/folder";
import STATUS_META from "@/constants/status-meta";

import DeleteDocumentModal from "@/components/dashboard/modals/document/DeleteDocumentModal";
import MoveToFolderModal from "@/components/dashboard/modals/document/MoveToFolderModal";

import useDocumentTab from "./useDocumentTab";

import ActionButton from "./components/ActionButton";
import ActionsDropDown from "./components/ActionsDropDown";
import DocumentRowCard from "./components/DocumentRowCard";
import DocumentsLoadingSkeleton from "./components/DocumentsLoadingSkeleton";
import SummaryContents from "./components/SummaryContents";
import DocumentError from "./components/DocumentError";
import EmptyDocument from "./components/EmptyDocument";
import { SearchIcon } from "lucide-react";
import ShareDocumentModal from "../../modals/document/ShareDocumentModal";

interface Props {
  userId: string;
  filterFolder: string;
  setFilterFolder: React.Dispatch<React.SetStateAction<string>>;
}

const STATUS_FILTERS = [
  "all",
  "uploaded",
  "processing",
  "completed",
  "failed",
] as const;
const TABLE_HEADERS = ["TYPE", "DOCUMENT", "SIZE", "STATUS", "DATE", "ACTIONS"];

function DocumentsTab({ userId, filterFolder, setFilterFolder }: Props) {
  const {
    // Loading
    documentsLoading,
    foldersLoading,

    // Data
    allDocs,
    allFolders,
    allSummaries,
    filteredDocs,
    documentErrorData,

    // State
    selectedDoc,
    actionsMenuOpen,
    filterStatus,
    isFetchingNextDocPage,
    hasNextDocPage,
    isNavigating,
    dropdownPosition,
    documentToDelete,
    documentToMove,
    documentToShare,
    moveModalOpen,
    shareModalOpen,
    deleteModalOpen,
    documentError,

    // Setters
    setFilterStatus,
    setSelectedDoc,
    setActionsMenuOpen,
    setMoveModalOpen,
    setDeleteModalOpen,
    setShareModalOpen,

    // Handlers
    handleNavigate,
    handleMoveClick,
    handleDeleteClick,
    handleDeleteSuccess,
    handleMoveSuccess,
    handleShareSuccess,
    handleReprocessClick,
    handleSearch,
    handleShareClick,
    fetchNextDocPage,
    refetchDocumentChats,

    // Refs
    actionsButtonRefs,
    loadMoreRef,
  } = useDocumentTab(userId, filterFolder);

  // ─── Guards ───────────────────────────────────────────────────────────────

  if (documentsLoading || foldersLoading) return <DocumentsLoadingSkeleton />;

  if (allDocs.length === 0) {
    return <EmptyDocument />;
  }

  if (documentError) {
    return (
      <DocumentError
        errorMessage={
          documentErrorData?.response?.data?.message ?? "Something went wrong"
        }
        refetchDocumentChats={refetchDocumentChats}
      />
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 p-1 bg-white/4 border border-white/8 rounded-sm flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilterStatus(s);
                setSelectedDoc(null);
              }}
              className={`px-3 py-1.5 text-[10px] tracking-[0.08em] font-sans rounded-sm transition-all duration-150 capitalize ${
                filterStatus === s
                  ? "bg-primary text-black font-bold"
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

        <div className="relative">
          <SearchIcon
            className="absolute top-1/2 left-3 -translate-y-1/2 text-text/40"
            size={14}
          />
          <input
            type="text"
            placeholder="Search"
            className="px-10 py-2 bg-white/4 border border-white/8 rounded-sm text-[11px] font-sans text-text/60 outline-none hover:border-primary/30 transition-colors duration-200 ease-in-out"
            onChange={handleSearch}
          />
        </div>

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

      {/* ── Document table ────────────────────────────────────────────────── */}
      <div className="border border-white/8 rounded-sm overflow-visible">
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/6 bg-white/2">
          {TABLE_HEADERS.map((h) => (
            <span
              key={h}
              className="text-[9px] tracking-[0.18em] text-text/25 font-sans"
            >
              {h}
            </span>
          ))}
        </div>

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
              const folder =
                typeof doc.folder === "object"
                  ? doc.folder
                  : allFolders.find((f) => f._id === doc.folder);
              const isSelected = selectedDoc?._id === doc._id;
              const isActionsOpen = actionsMenuOpen === doc._id;

              // Resolve summary for this doc
              const summary = allSummaries.find((s) => {
                const sid =
                  s.document && typeof s.document === "object"
                    ? s.document._id
                    : typeof s.document === "string"
                      ? s.document
                      : null;
                return sid === doc._id;
              });

              const noSummaryMessage =
                doc.status === "processing"
                  ? "Processing — summary will appear when complete."
                  : doc.status === "failed"
                    ? "Processing failed. Please re-upload the document."
                    : doc.status === "uploaded"
                      ? "Document uploaded — press more to generate a summary."
                      : "No summary generated yet.";

              return (
                <div
                  key={doc._id}
                  className={`grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : "hover:bg-white/3"
                  }`}
                >
                  <DocumentRowCard
                    document={doc}
                    isSelected={isSelected}
                    setSelectedDoc={setSelectedDoc}
                    folder={folder}
                  />

                  <ActionButton
                    document={doc}
                    actionsButtonRefs={actionsButtonRefs}
                    setActionsMenuOpen={setActionsMenuOpen}
                    isNavigating={isNavigating}
                    isActionsOpen={isActionsOpen}
                  />

                  {isSelected && (
                    <div className="col-span-full mt-3 pt-3 border-t border-primary/10">
                      {summary ? (
                        <SummaryContents summary={summary} />
                      ) : (
                        <div className="text-[12px] text-text/30 font-sans flex items-center gap-2">
                          <span className="text-text/20">◎</span>
                          {noSummaryMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Actions dropdown (portal) ─────────────────────────────────────── */}
      {actionsMenuOpen &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <ActionsDropDown
            actionsMenuOpen={actionsMenuOpen}
            isNavigating={isNavigating}
            dropdownPosition={dropdownPosition}
            handleNavigate={handleNavigate}
            handleMoveClick={handleMoveClick}
            handleDeleteClick={handleDeleteClick}
            handleReprocessClick={handleReprocessClick}
            handleShareClick={handleShareClick}
            filteredDocs={filteredDocs}
          />,
          document.body,
        )}

      {/* ── Load more ─────────────────────────────────────────────────────── */}
      {hasNextDocPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextDocPage ? (
            <div className="flex items-center justify-center gap-2 text-[12px] text-text/40 font-sans">
              <p className="text-[12px] text-primary font-sans tracking-widest">
                Loading more documents
              </p>
              <ThreeDot color="#c9a227" size="small" textColor="" />
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

      {/* ── Modals ────────────────────────────────────────────────────────── */}
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

      {documentToShare && (
        <ShareDocumentModal
          userId={userId}
          document={documentToShare}
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          onSuccess={handleShareSuccess}
        />
      )}
    </div>
  );
}

export default DocumentsTab;
