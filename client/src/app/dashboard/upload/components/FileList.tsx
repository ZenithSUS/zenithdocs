import { UploadFile } from "../upload.types";
import { getFileIcon, formatFileSize } from "../upload.utils";

interface Props {
  files: UploadFile[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const StatusIcon = ({ status }: { status: UploadFile["status"] }) => {
  if (status === "processing") return null;
  if (status === "success")
    return <span className="text-[#10b981] text-sm shrink-0">✓</span>;
  if (status === "error")
    return <span className="text-[#ef4444] text-sm shrink-0">⚠</span>;
  return null;
};

const FileListItem = ({
  uploadFile,
  onRemove,
}: {
  uploadFile: UploadFile;
  onRemove: (id: string) => void;
}) => (
  <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-4 transition-all duration-300 hover:border-[#C9A227]/25">
    <div className="flex items-start gap-4">
      <div className="text-2xl shrink-0">
        {getFileIcon(uploadFile.file.name)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-normal truncate font-serif">
              {uploadFile.file.name}
            </p>
            <p className="text-[11px] text-[#F5F5F5]/40 font-sans">
              {formatFileSize(uploadFile.file.size)}
            </p>
          </div>

          {uploadFile.status === "processing" ? (
            <button
              onClick={() => onRemove(uploadFile.id)}
              className="text-[#F5F5F5]/40 hover:text-[#ef4444] transition-colors shrink-0"
            >
              ✕
            </button>
          ) : (
            <StatusIcon status={uploadFile.status} />
          )}
        </div>

        {uploadFile.status === "uploading" && (
          <div className="mt-2">
            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A227] transition-all duration-300 rounded-full"
                style={{ width: `${uploadFile.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-[#F5F5F5]/40 mt-1 font-sans">
              {uploadFile.progress}%
            </p>
          </div>
        )}

        {uploadFile.error && (
          <p className="text-[11px] text-[#ef4444] mt-2 font-sans">
            {uploadFile.error}
          </p>
        )}
      </div>
    </div>
  </div>
);

const FileList = ({ files, onRemove, onClear }: Props) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] tracking-[0.15em] text-[#C9A227] font-sans">
          FILES ({files.length})
        </h3>
        <button
          onClick={onClear}
          className="text-[11px] tracking-[0.12em] text-[#F5F5F5]/50 hover:text-[#F5F5F5] transition-colors font-sans"
        >
          CLEAR ALL
        </button>
      </div>

      <div className="space-y-3">
        {files.map((f) => (
          <FileListItem key={f.id} uploadFile={f} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

export default FileList;
