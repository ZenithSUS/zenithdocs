import { AxiosError } from "@/types/api";

interface SharedDocumentErrorProps {
  refetchSharedDocuments: () => void;
  error: AxiosError | null;
}

function SharedDocumentError({
  refetchSharedDocuments,
  error,
}: SharedDocumentErrorProps) {
  const errorMessage =
    error?.response?.data?.message || "Failed to load shared documents";

  return (
    <div className="border border-red-500/20  rounded-lg px-6 py-8 text-center">
      <div className="text-[40px] text-red-400/30 mb-3">⚠️</div>

      <h3 className="text-[18px] font-serif text-text/80 mb-2">
        Unable to Load Shared Documents
      </h3>

      <p className="text-[12px] text-text/50 font-sans max-w-md mx-auto leading-relaxed mb-4">
        {errorMessage}
      </p>

      {/* Error details box */}
      <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg max-w-md mx-auto">
        <div className="flex items-start gap-2">
          <span className="text-red-400 text-sm shrink-0 mt-0.5">⚠️</span>
          <div className="text-left flex-1">
            <p className="text-[10px] tracking-[0.12em] text-red-400/70 mb-1 font-sans">
              ERROR DETAILS
            </p>
            <p className="text-[11px] text-text/60 font-sans leading-[1.6]">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={refetchSharedDocuments}
        className="px-6 py-2 bg-primary text-background text-[11px] font-bold tracking-wider font-sans rounded-sm hover:bg-[#e0b530] hover:-translate-y-0.5 transition-all duration-200"
      >
        TRY AGAIN
      </button>

      {/* Help text */}
      <div className="mt-5 p-3 bg-white/5 border border-white/10 rounded-lg max-w-lg mx-auto">
        <div className="flex items-start gap-2">
          <span className="text-[#C9A227] text-sm shrink-0 mt-0.5">💡</span>
          <div className="text-left flex-1">
            <p className="text-[11px] text-text/60 font-sans leading-[1.6]">
              <strong className="text-text/80">Still having issues?</strong> Try
              refreshing the page, checking your internet connection, or contact
              support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedDocumentError;
