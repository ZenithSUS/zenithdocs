import Doc, { DocStatus } from "@/types/doc";
import { Folder } from "@/types/folder";
import { NavItem } from "@/components/dashboard/Sidebar";
import STATUS_META from "@/constants/status-meta";
import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";

interface FolderDashBoardProps {
  setFilterFolder: React.Dispatch<React.SetStateAction<string>>;
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  documents: Doc[];
  folders: Folder[];
}

function FolderDashBoard({
  setFilterFolder,
  setNav,
  documents,
  folders,
}: FolderDashBoardProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => {
          const docs = documents.filter((d) => d.folder === folder._id);
          const completed = docs.filter((d) => d.status === "completed").length;
          const totalSize = docs.reduce((acc, d) => acc + d.fileSize, 0);
          return (
            <div
              key={folder._id}
              onClick={() => {
                setFilterFolder(folder._id);
                setNav("documents");
              }}
              className="border border-white/8 rounded-sm px-6 py-6 cursor-pointer hover:border-primary/25 hover:bg-primary/3 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-5">
                <span className="text-[28px] text-primary/70 group-hover:text-primary transition-colors">
                  ⬡
                </span>
                <span className="text-[10px] text-text/20 font-sans tracking-wider">
                  {sizefmt.date(folder.createdAt)}
                </span>
              </div>
              <div className="text-[16px] font-serif mb-1">{folder.name}</div>
              <div className="text-[12px] text-text/30 font-sans mb-5">
                {docs.length} documents · {sizefmt.bytes(totalSize)}
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "uploaded",
                    "processing",
                    "completed",
                    "failed",
                  ] as DocStatus[]
                )
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
                            `${sm.dot.replace("bg-", "").replace("-400", "")}-400`.includes(
                              "green",
                            )
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
              {docs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/6">
                  <div className="w-full h-1 bg-white/6 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400/50 rounded-full"
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
            </div>
          );
        })}

        {/* New folder CTA */}
        <div className="border border-dashed border-white/10 rounded-sm px-6 py-6 flex flex-col items-center justify-center gap-3 hover:border-primary/20 hover:bg-primary/3 transition-all duration-200 cursor-pointer min-h-45">
          <span className="text-[28px] text-text/15">+</span>
          <span className="text-[12px] text-text/25 font-sans tracking-wider">
            NEW FOLDER
          </span>
        </div>
      </div>

      {/* Unorganised docs */}
      {documents.filter((d) => !d.folder).length > 0 && (
        <div className="border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/6 bg-white/2 flex items-center gap-2">
            <span className="text-[11px] tracking-[0.15em] text-text/40 font-sans">
              UNFILED DOCUMENTS
            </span>
            <span className="ml-auto text-[10px] text-text/20 font-sans">
              {documents.filter((d) => !d.folder).length}
            </span>
          </div>
          <div className="divide-y divide-white/4">
            {documents
              .filter((d) => !d.folder)
              .map((doc) => {
                const sm = STATUS_META[doc.status];
                return (
                  <div
                    key={doc._id}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/3 transition-colors"
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
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderDashBoard;
