import { AxiosError } from "@/types/api";
import { AlertCircle } from "lucide-react";

interface LearningSetErrorProps {
  refetchLearningSets: () => void;
  error: AxiosError | null;
}

function LearningSetError({
  refetchLearningSets,
  error,
}: LearningSetErrorProps) {
  const errorMessage =
    error?.response?.data?.message || "Failed to load learning sets";

  return (
    <div className="border border-red-500/20  rounded-lg px-6 py-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <AlertCircle color="red" className="w-12 h-12 mb-3" />

        <h3 className="text-[18px] font-serif text-text/80 mb-2">
          Unable to Load Learning Sets
        </h3>

        <p className="text-[12px] text-text/50 font-sans max-w-md mx-auto leading-relaxed mb-4">
          {errorMessage}
        </p>
      </div>

      {/* Error details box */}
      <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg max-w-md mx-auto">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4" color="red" />

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

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={refetchLearningSets}
          className="px-6 py-2 bg-primary text-background text-[11px] font-bold tracking-wider font-sans rounded-sm hover:bg-[#e0b530] hover:-translate-y-0.5 transition-all duration-200"
        >
          TRY AGAIN
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/5 text-white/50 text-[11px] font-bold tracking-wider font-sans rounded-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
        >
          REFRESH PAGE
        </button>
      </div>

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

export default LearningSetError;
