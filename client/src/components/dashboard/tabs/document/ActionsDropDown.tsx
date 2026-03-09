import Doc from "@/types/doc";
import {
  EyeIcon,
  FolderPlus,
  MessageCircle,
  SparkleIcon,
  TrashIcon,
} from "lucide-react";

interface ActionsDropDownProps {
  actionsMenuOpen: string;
  isNavigating: boolean;
  dropdownPosition: {
    top: number;
    left: number;
  };
  handleNavigate: (path: string) => void;
  handleMoveClick: (
    docId: string,
    docTitle: string,
    folderId?: string | null | undefined,
  ) => void;
  handleDeleteClick: (docId: string, docTitle: string) => void;
  filteredDocs: Doc[];
}

function ActionsDropDown({
  actionsMenuOpen,
  isNavigating,
  dropdownPosition,
  handleNavigate,
  handleMoveClick,
  handleDeleteClick,
  filteredDocs,
}: ActionsDropDownProps) {
  return (
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
              typeof doc.folder === "object" ? doc.folder?._id : doc.folder;
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

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNavigate(`/dashboard/chat?doc=${actionsMenuOpen}`);
        }}
        className="w-full px-4 py-2.5 text-left text-[12px] font-sans text-text/70 hover:bg-white/5 hover:text-text transition-colors flex items-center gap-2"
      >
        <span>
          <MessageCircle className="w-4 h-4" />
        </span>{" "}
        Chat
      </button>

      {/* Separator */}
      <div className="border-t border-white/8" />

      {/* Delete button */}
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
    </div>
  );
}

export default ActionsDropDown;
