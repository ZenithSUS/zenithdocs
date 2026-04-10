import STATUS_META from "@/constants/status-meta";
import sizefmt from "@/helpers/size-format";
import Doc, { DocStatus } from "@/types/doc";
import { Folder } from "@/types/folder";
import RenameFolderModal from "@/components/dashboard/modals/folder/RenameFolderModal";
import DeleteFolderModal from "../modals/folder/DeleteFolderModal";

interface FolderCardProps {
  folder: Folder;
  docs: Doc[];
  handleFolderClick: (folderId: string) => void;
}

const FolderCard = ({ folder, docs, handleFolderClick }: FolderCardProps) => {
  const completed = docs.filter((d) => d.status === "completed").length;
  const totalSize = docs.reduce((acc, d) => acc + d.fileSize, 0);
  const userId =
    typeof folder.user === "object" ? folder.user._id : folder.user;

  return (
    <div className="border border-white/8 rounded-[10px] px-5 py-5 hover:border-primary/25 hover:bg-primary/3 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[22px] leading-none text-primary/60 group-hover:text-primary/90 transition-colors">
          ⬡
        </span>
        <span className="text-[10px] text-text/20 font-sans tracking-wider tabular-nums">
          {sizefmt.date(folder.createdAt)}
        </span>
      </div>

      {/* Title + Actions */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span
          className="text-[15px] font-medium truncate cursor-pointer hover:text-[#C9A227] transition-colors duration-150 flex-1"
          title={folder.name}
          onClick={() => handleFolderClick(folder._id)}
        >
          {folder.name}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <RenameFolderModal
            userId={userId}
            folderId={folder._id}
            folderName={folder.name}
          />
          <DeleteFolderModal userId={userId} folderId={folder._id} />
        </div>
      </div>

      {/* Meta */}
      <p className="text-[11px] text-text/30 font-sans mb-3.5 tracking-wide">
        {docs.length} document{docs.length !== 1 ? "s" : ""}
        {totalSize > 0 && ` · ${sizefmt.bytes(totalSize)}`}
      </p>

      <hr className="border-t border-white/6 mb-3" />

      {/* Status badges */}
      {docs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {(["uploaded", "processing", "completed", "failed"] as DocStatus[])
            .filter((s) => docs.some((d) => d.status === s))
            .map((s) => {
              const sm = STATUS_META[s];
              const cnt = docs.filter((d) => d.status === s).length;
              return (
                <span
                  key={s}
                  className={`flex items-center gap-1.5 text-[10px] font-sans ${sm.text} px-2 py-0.5 rounded-full border tracking-wide`}
                  style={{
                    borderColor:
                      s === "completed"
                        ? "rgba(74,222,128,0.2)"
                        : "rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    className={`w-1.25 h-1.25 rounded-full shrink-0 ${sm.dot}`}
                  />
                  {cnt} {sm.label}
                </span>
              );
            })}
        </div>
      )}

      {/* Progress bar */}
      {docs.length > 0 && (
        <div>
          <div className="w-full h-0.75 bg-white/6 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-green-400/50 rounded-full transition-all duration-300"
              style={{ width: `${(completed / docs.length) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-text/22 font-sans tracking-wide">
            {completed} / {docs.length} completed
          </p>
        </div>
      )}

      {/* Empty state */}
      {docs.length === 0 && (
        <p className="text-[11px] text-text/20 font-sans text-center py-1.5">
          No documents yet
        </p>
      )}
    </div>
  );
};

export default FolderCard;
