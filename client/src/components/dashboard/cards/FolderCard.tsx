import STATUS_META from "@/constants/status-meta";
import sizefmt from "@/helpers/size-format";
import Doc, { DocStatus } from "@/types/doc";
import { Folder } from "@/types/folder";
import RenameFolderModal from "@/components/dashboard/modals/folder/RenameFolderModal";

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
    <div
      key={folder._id}
      className="border border-white/8 rounded-sm px-6 py-6  hover:border-primary/25 hover:bg-primary/3 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-5">
        <span className="text-[28px] text-primary/70 group-hover:text-primary transition-colors">
          ⬡
        </span>
        <span className="text-[10px] text-text/20 font-sans tracking-wider">
          {sizefmt.date(folder.createdAt)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div
          className="text-[16px] font-serif mb-1 truncate cursor-pointer w-fit hover:text-[#C9A227] transition-colors duration-150"
          title={folder.name}
          onClick={() => handleFolderClick(folder._id)}
        >
          {folder.name}
        </div>

        <RenameFolderModal
          userId={userId}
          folderId={folder._id}
          folderName={folder.name}
        />
      </div>

      <div className="text-[12px] text-text/30 font-sans mb-5">
        {docs.length} document{docs.length !== 1 ? "s" : ""}
        {totalSize > 0 && ` · ${sizefmt.bytes(totalSize)}`}
      </div>

      {/* Status badges */}
      {docs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(["uploaded", "processing", "completed", "failed"] as DocStatus[])
            .filter((s) => docs.some((d) => d.status === s))
            .map((s) => {
              const sm = STATUS_META[s];
              const cnt = docs.filter((d) => d.status === s).length;
              return (
                <span
                  key={s}
                  className={`flex items-center gap-1 text-[10px] font-sans ${sm.text} px-2 py-0.5 rounded-full border`}
                  style={{
                    borderColor:
                      s === "completed"
                        ? "rgba(74,222,128,0.2)"
                        : "rgba(255,255,255,0.06)",
                  }}
                >
                  <span className={`w-1 h-1 rounded-full ${sm.dot}`} />
                  {cnt} {sm.label}
                </span>
              );
            })}
        </div>
      )}

      {/* Completion progress bar */}
      {docs.length > 0 && (
        <div className="pt-4 border-t border-white/6">
          <div className="w-full h-1 bg-white/6 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400/50 rounded-full transition-all duration-300"
              style={{
                width: `${(completed / docs.length) * 100}%`,
              }}
            />
          </div>
          <div className="text-[10px] text-text/25 font-sans mt-1.5">
            {completed}/{docs.length} completed
          </div>
        </div>
      )}

      {/* Empty folder indicator */}
      {docs.length === 0 && (
        <div className="pt-4 border-t border-white/6 text-[11px] text-text/20 font-sans text-center">
          Empty folder
        </div>
      )}
    </div>
  );
};

export default FolderCard;
