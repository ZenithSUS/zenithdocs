import { UploadFile } from "../upload.types";
import { getFileIcon, formatFileSize } from "../upload.utils";
import { CheckCircle, AlertTriangle, X, AlertCircle } from "lucide-react";

interface Props {
  files: UploadFile[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const StatusIcon = ({ status }: { status: UploadFile["status"] }) => {
  if (status === "success")
    return <CheckCircle size={15} className="text-[#10b981] shrink-0" />;
  if (status === "error")
    return <AlertTriangle size={15} className="text-[#ef4444] shrink-0" />;
  return null;
};

const FileListItem = ({
  uploadFile,
  onRemove,
}: {
  uploadFile: UploadFile;
  onRemove: (id: string) => void;
}) => {
  const isError = uploadFile.status === "error";
  const isSuccess = uploadFile.status === "success";
  const isProcessing = uploadFile.status === "processing";

  return (
    <div
      className={`border rounded-lg p-4 transition-all duration-300 ${
        isError
          ? "bg-[rgba(239,68,68,0.06)] border-[#ef4444]/25"
          : isSuccess
            ? "bg-[rgba(16,185,129,0.06)] border-[#10b981]/25"
            : "bg-white/8 border-[#C9A227]/12 hover:border-[#C9A227]/25"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl shrink-0">
          {getFileIcon(uploadFile.file.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-normal truncate font-serif ${
                  isError ? "text-[#ef4444]/80" : ""
                }`}
              >
                {uploadFile.file.name}
              </p>
              <p className="text-[11px] text-[#F5F5F5]/40 font-sans">
                {formatFileSize(uploadFile.file.size)}
              </p>
            </div>

            {isProcessing ? (
              <button
                onClick={() => onRemove(uploadFile.id)}
                className="text-[#F5F5F5]/40 hover:text-[#ef4444] transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            ) : (
              <StatusIcon status={uploadFile.status} />
            )}
          </div>

          {/* Progress bar */}
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

          {/* Error message */}
          {uploadFile.error && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-[11px] text-[#ef4444] font-sans flex items-center gap-1">
                <AlertCircle size={11} />
                {uploadFile.error}
              </p>
              <button
                onClick={() => onRemove(uploadFile.id)}
                className="text-[11px] text-[#F5F5F5]/40 hover:text-[#ef4444] transition-colors font-sans tracking-wide"
              >
                DISMISS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileList = ({ files, onRemove, onClear }: Props) => {
  if (files.length === 0) return null;

  const errorCount = files.filter((f) => f.status === "error").length;
  const successCount = files.filter((f) => f.status === "success").length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] tracking-[0.15em] text-[#C9A227] font-sans">
            FILES ({files.length})
          </h3>
          {successCount > 0 && (
            <span className="text-[10px] text-[#10b981] font-sans tracking-wide">
              {successCount} done
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-[10px] text-[#ef4444] font-sans tracking-wide">
              {errorCount} failed
            </span>
          )}
        </div>
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
