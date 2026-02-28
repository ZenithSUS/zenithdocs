import STATUS_META from "@/constants/status-meta";
import { NavItem } from "../Sidebar";
import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";
import Doc from "@/types/doc";
import { useRouter } from "next/navigation";

interface DocumentCardProps {
  document: Doc;
}

function DocumentCard({ document: doc }: DocumentCardProps) {
  const router = useRouter();

  const sm = STATUS_META[doc.status];
  const doctype = doc.fileType;
  const folder = doc.folder;
  const folderTitle =
    typeof folder === "object" && folder !== null ? folder.name : "No folder";

  const handleNavigate = () => {
    router.push(`/dashboard/document/${doc._id}`);
  };

  return (
    <div
      key={doc._id}
      onClick={handleNavigate}
      className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/3 cursor-pointer transition-colors duration-150"
    >
      <FileIcon type={doctype} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-sans text-text/80 truncate">
          {doc.title}
        </div>
        <div className="text-[11px] text-text/30 font-sans mt-0.5">
          {folderTitle ?? "No folder"} · {sizefmt.bytes(doc.fileSize)}
        </div>
      </div>
      <div
        className={`flex items-center gap-1.5 text-[10px] font-sans ${sm.text} shrink-0`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${doc.status === "processing" ? "animate-pulse" : ""}`}
        />
        <span className="hidden sm:inline">{sm.label}</span>
      </div>
    </div>
  );
}

export default DocumentCard;
