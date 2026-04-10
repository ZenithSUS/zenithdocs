import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const SummaryEmptyState = () => {
  const router = useRouter();

  return (
    <div className="border border-white/8 rounded-sm px-8 py-16 text-center flex flex-col gap-2 items-center">
      <div className="text-[48px] text-text/10 mb-4">◎</div>
      <h3 className="text-[18px] font-serif text-text/60 mb-2">
        No summaries yet
      </h3>
      <p className="text-[13px] text-text/30 font-sans max-w-sm mx-auto mb-2">
        Upload a document to generate AI-powered summaries in multiple formats.
      </p>

      <button
        className="bg-primary font-sans font-bold hover:bg-[#e0b530] cursor-pointer text-black px-4 py-2 rounded-md text-[12px] tracking-widest flex items-center gap-2"
        onClick={() => router.replace("/dashboard/upload")}
      >
        <Upload />
        UPLOAD DOCUMENT
      </button>
    </div>
  );
};

export default SummaryEmptyState;
