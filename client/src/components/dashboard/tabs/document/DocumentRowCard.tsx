import FileIcon from "@/components/FileIcon";
import STATUS_META from "@/constants/status-meta";
import sizefmt from "@/helpers/size-format";
import Doc from "@/types/doc";
import { SetStateAction } from "react";

interface DocumentRowCardProps {
  document: Doc;
  isSelected: boolean;
  setSelectedDoc: (value: SetStateAction<Doc | null>) => void;
  folder:
    | {
        _id: string;
        name: string;
      }
    | null
    | undefined;
}

function DocumentRowCard({
  document: doc,
  isSelected,
  setSelectedDoc,
  folder,
}: DocumentRowCardProps) {
  const sm = STATUS_META[doc.status];

  return (
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
          {folder?.name ?? "No folder"} · {sizefmt.bytes(doc.fileSize)}
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
  );
}

export default DocumentRowCard;
