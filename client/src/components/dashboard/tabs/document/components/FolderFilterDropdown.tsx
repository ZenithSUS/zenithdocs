import Doc from "@/types/doc";
import { SetStateAction } from "react";
import { ThreeDot } from "react-loading-indicators";

interface FolderFilterDropdownProps {
  allFolders: { _id: string; name: string }[];
  filterFolder: string;
  setFilterFolder: (folderId: string) => void;
  setSelectedDoc: (doc: Doc | null) => void;
  hasNextFolderPage: boolean;
  isFetchingNextFolderPage: boolean;
  fetchNextFolderPage: () => void;
  folderDropdownOpen: boolean;
  setFolderDropdownOpen: (value: SetStateAction<boolean>) => void;
  folderDropdownRef: React.RefObject<HTMLDivElement | null>;
}

function FolderFilterDropdown({
  allFolders,
  filterFolder,
  setFilterFolder,
  setSelectedDoc,
  hasNextFolderPage,
  isFetchingNextFolderPage,
  fetchNextFolderPage,
  folderDropdownOpen,
  setFolderDropdownOpen,
  folderDropdownRef,
}: FolderFilterDropdownProps) {
  return (
    <div className="relative" ref={folderDropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setFolderDropdownOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-white/4 border border-white/8 rounded-sm text-[11px] font-sans text-text/60 outline-none hover:border-primary/30 transition-colors cursor-pointer min-w-35 justify-between"
      >
        <span>
          {filterFolder === "all"
            ? "All Folders"
            : filterFolder === ""
              ? "No Folder"
              : (allFolders.find((f) => f._id === filterFolder)?.name ??
                "Folder")}
        </span>
        <svg
          className={`w-3 h-3 transition-transform duration-150 ${folderDropdownOpen ? "rotate-180" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {folderDropdownOpen && (
        <div className="absolute z-50 top-full mt-1 left-0 min-w-40 bg-[#1a1a1a] border border-white/10 rounded-sm shadow-xl overflow-hidden">
          {/* Scrollable options */}
          <div className="max-h-52 overflow-y-auto">
            {[
              { _id: "all", name: "All Folders" },
              ...allFolders,
              { _id: "", name: "No Folder" },
            ].map((f) => (
              <button
                key={f._id ?? "no-folder"}
                onClick={() => {
                  setFilterFolder(f._id);
                  setSelectedDoc(null);
                  setFolderDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[11px] font-sans transition-colors duration-100 ${
                  filterFolder === f._id
                    ? "bg-primary/15 text-primary"
                    : "text-text/60 hover:bg-white/6 hover:text-text/80"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Load more — inside the dropdown */}
          {hasNextFolderPage && (
            <div className="border-t border-white/6">
              {isFetchingNextFolderPage ? (
                <div className="flex items-center justify-center gap-2 px-3 py-2 text-[11px] text-text/40 font-sans">
                  <span>Loading</span>
                  <ThreeDot size="small" color="#c9a227" />
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchNextFolderPage();
                  }}
                  className="w-full px-3 py-2 text-[11px] text-text/40 font-sans hover:text-primary hover:bg-white/4 transition-colors duration-150 text-center"
                >
                  Load more
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FolderFilterDropdown;
