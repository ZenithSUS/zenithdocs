import React, { SetStateAction } from "react";
import FileIcon from "@/components/FileIcon";
import STATUS_META from "@/constants/status-meta";
import sizefmt from "@/helpers/size-format";
import Doc from "@/types/doc";
import { Check, X } from "lucide-react";

interface Props {
  document: Doc;
  isSelected: boolean;
  setSelectedDoc: (value: SetStateAction<Doc | null>) => void;
  folder: { _id: string; name: string } | null | undefined;
  actionButton: React.ReactNode;
}

const DocumentRowCard = ({
  document: doc,
  isSelected,
  setSelectedDoc,
  folder,
  actionButton,
}: Props) => {
  const sm = STATUS_META[doc.status];

  const handleSelectDoc = () => {
    setSelectedDoc(isSelected ? null : doc);
  };

  return (
    <div
      className="flex items-center gap-3 sm:contents min-w-0 flex-1 cursor-pointer truncate"
      onClick={handleSelectDoc}
    >
      {/* Col 1: TYPE */}
      <div className="shrink-0 my-auto">
        <FileIcon type={doc.fileType} />
      </div>

      {/* Col 2: DOCUMENT */}
      <div className="min-w-0 my-auto flex-1 overflow-hidden w-0 sm:w-auto">
        <div className="text-[13px] font-sans text-text/80 truncate max-w-full">
          {doc.title}
        </div>
        {/* Mobile subtitle: folder · size · status dot · shared */}
        <div className="flex items-center gap-2 text-[11px] text-text/30 font-sans mt-0.5 sm:hidden">
          <span>{folder?.name ?? "No folder"}</span>
          <span>·</span>
          <span>{sizefmt.bytes(doc.fileSize)}</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${
              doc.status === "processing" ? "animate-pulse" : ""
            }`}
          />
          {doc.isShared ? (
            <Check size={12} className="text-primary" />
          ) : (
            <X size={12} className="text-red-500" />
          )}
        </div>
        {/* Desktop subtitle: folder only */}
        <div className="text-[11px] text-text/30 font-sans mt-0.5 hidden sm:block">
          {folder?.name ?? "No folder"}
        </div>
      </div>

      {/* Col 3: SIZE — desktop only */}
      <span className="text-[12px] text-text/35 font-sans my-auto hidden sm:block">
        {sizefmt.bytes(doc.fileSize)}
      </span>

      {/* Col 4: STATUS — desktop only */}
      <div
        className={`items-center gap-1.5 text-[11px] font-sans my-auto hidden sm:flex ${sm.text}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${doc.status === "processing" ? "animate-pulse" : ""}`}
        />
        <span>{sm.label}</span>
      </div>

      {/* Col 5: SHARED — desktop only */}
      <span className="my-auto hidden sm:block">
        {doc.isShared ? (
          <Check size={16} className="text-primary" />
        ) : (
          <X size={16} className="text-red-500" />
        )}
      </span>

      {/* Col 6: DATE — desktop only */}
      <span className="text-[11px] text-text/25 text-right my-auto font-sans hidden sm:block">
        {sizefmt.date(doc.createdAt)}
      </span>

      {/* Col 7: ACTIONS */}
      <div
        className="my-auto ml-auto sm:ml-0"
        onClick={(e) => e.stopPropagation()}
      >
        {actionButton}
      </div>
    </div>
  );
};

export default DocumentRowCard;
