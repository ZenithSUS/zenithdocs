import {
  CogIcon,
  EyeIcon,
  FolderPlus,
  MessageCircle,
  ShareIcon,
  SparkleIcon,
  TrashIcon,
} from "lucide-react";
import Doc, { DocumentShareInfo } from "@/types/doc";

interface Props {
  actionsMenuOpen: string;
  isNavigating: boolean;
  dropdownPosition: { top: number; left: number };
  handleNavigate: (path: string) => void;
  handleMoveClick: (
    docId: string,
    docTitle: string,
    folderId?: string | null,
  ) => void;
  handleDeleteClick: (docId: string, docTitle: string) => void;
  handleReprocessClick: (docId: string) => Promise<void>;
  handleShareClick: (data: DocumentShareInfo) => void;
  filteredDocs: Doc[];
}

const DropdownButton = ({
  onClick,
  disabled,
  danger,
  icon,
  label,
}: {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  danger?: boolean;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full px-4 py-2.5 text-left text-[12px] font-sans flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      danger
        ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
        : "text-text/70 hover:bg-white/5 hover:text-text"
    }`}
  >
    {icon}
    {label}
  </button>
);

const ActionsDropDown = ({
  actionsMenuOpen,
  isNavigating,
  dropdownPosition,
  handleNavigate,
  handleMoveClick,
  handleDeleteClick,
  handleReprocessClick,
  handleShareClick,
  filteredDocs,
}: Props) => {
  const doc = filteredDocs.find((d) => d._id === actionsMenuOpen);
  const status = doc?.status ?? "failed";

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
      <DropdownButton
        onClick={(e) => {
          e.stopPropagation();
          handleNavigate(`/dashboard/document/${actionsMenuOpen}`);
        }}
        disabled={isNavigating}
        icon={<EyeIcon className="w-4 h-4" />}
        label="View Document"
      />
      <DropdownButton
        onClick={(e) => {
          e.stopPropagation();
          handleNavigate(`/dashboard/summarize?doc=${actionsMenuOpen}`);
        }}
        disabled={isNavigating}
        icon={<SparkleIcon className="w-4 h-4" />}
        label="Summarize"
      />
      <DropdownButton
        onClick={(e) => {
          e.stopPropagation();
          if (doc) {
            const folderId =
              typeof doc.folder === "object" ? doc.folder?._id : doc.folder;
            handleMoveClick(doc._id, doc.title, folderId);
          }
        }}
        icon={<FolderPlus className="w-4 h-4" />}
        label="Move to Folder"
      />
      <DropdownButton
        onClick={(e) => {
          e.stopPropagation();
          handleNavigate(`/dashboard/chat?doc=${actionsMenuOpen}`);
        }}
        icon={<MessageCircle className="w-4 h-4" />}
        label="Chat"
      />
      <DropdownButton
        onClick={(e) => {
          e.stopPropagation();
          if (doc)
            handleShareClick({
              id: doc._id,
              title: doc.title,
              fileSize: doc.fileSize,
              fileType: doc.fileType,
              fileUrl: doc.fileUrl,
            });
        }}
        icon={<ShareIcon className="w-4 h-4" />}
        label="Share"
      />

      <div className="border-t border-white/8" />

      {(status === "failed" || status === "uploaded") && (
        <DropdownButton
          onClick={(e) => {
            e.stopPropagation();
            handleReprocessClick(actionsMenuOpen);
          }}
          icon={<CogIcon className="w-4 h-4" />}
          label="Reprocess"
        />
      )}

      <DropdownButton
        onClick={(e) => {
          e.stopPropagation();
          if (doc) handleDeleteClick(doc._id, doc.title);
        }}
        disabled={isNavigating}
        danger
        icon={<TrashIcon className="w-4 h-4" />}
        label="Delete"
      />
    </div>
  );
};

export default ActionsDropDown;
