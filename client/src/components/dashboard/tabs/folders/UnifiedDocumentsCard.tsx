import FileIcon from "@/components/FileIcon";
import Doc from "@/types/doc";
import { SetStateAction } from "react";
import { NavItem } from "../../Sidebar";
import STATUS_META from "@/constants/status-meta";

interface UnifiedDocumentsProps {
  document: Doc;
  setNav: (value: SetStateAction<NavItem>) => void;
}

function UnifiedDocumentsCard({
  document: doc,
  setNav,
}: UnifiedDocumentsProps) {
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
}

export default UnifiedDocumentsCard;
