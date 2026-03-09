import { useRouter } from "next/navigation";

interface Props {
  hasValidFiles: boolean;
  hasUploadingFiles: boolean;
  isReady: boolean;
  onUpload: () => void;
}

const UploadActions = ({
  hasValidFiles,
  hasUploadingFiles,
  isReady,
  onUpload,
}: Props) => {
  const router = useRouter();
  const canUpload = hasValidFiles && !hasUploadingFiles && isReady;

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button
        onClick={onUpload}
        disabled={!canUpload}
        className={`flex-1 sm:flex-initial px-10 py-4 rounded-sm text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 ${
          canUpload
            ? "bg-[#C9A227] text-[#111111] hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)]"
            : "bg-[#C9A227]/30 text-[#111111]/50 cursor-not-allowed"
        }`}
      >
        {hasUploadingFiles ? "UPLOADING..." : "START UPLOAD →"}
      </button>
      <button
        onClick={() => router.push("/dashboard")}
        className="flex-1 sm:flex-initial px-10 py-4 bg-transparent border border-[#F5F5F5]/15 text-[#F5F5F5] rounded-sm text-[13px] tracking-[0.12em] font-sans transition-all duration-200 hover:border-[#F5F5F5]/40"
      >
        CANCEL
      </button>
    </div>
  );
};

export default UploadActions;
