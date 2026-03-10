import { FileInputIcon } from "lucide-react";
import { ACCEPTED_FORMATS } from "../upload.types";

interface Props {
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DropZone = ({
  isDragging,
  fileInputRef,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
}: Props) => (
  <div
    onDragEnter={onDragEnter}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${
      isDragging
        ? "border-[#C9A227] bg-[#C9A227]/5 scale-[1.02]"
        : "border-[#C9A227]/30 bg-[rgba(31,41,55,0.2)] hover:border-[#C9A227]/50"
    }`}
  >
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept={ACCEPTED_FORMATS.join(",")}
      onChange={onFileInput}
      className="hidden"
    />

    <div className="px-8 py-16 sm:py-20 text-center flex items-center flex-col">
      <FileInputIcon className="mb-6 animate-pulse" size={50} color="#C9A227" />
      <h2 className="text-xl sm:text-2xl font-normal mb-3 font-serif">
        Drop your files here
      </h2>
      <p className="text-sm text-[#F5F5F5]/55 mb-6 font-sans">
        or click to browse
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-8 py-3 bg-[#C9A227] text-[#111111] rounded-sm text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,162,39,0.3)]"
      >
        BROWSE FILES
      </button>
      <div className="mt-6 text-[11px] text-[#F5F5F5]/40 tracking-[0.08em] font-sans">
        SUPPORTED: {ACCEPTED_FORMATS.join(", ").toUpperCase()} • MAX 10MB
      </div>
    </div>
  </div>
);

export default DropZone;
