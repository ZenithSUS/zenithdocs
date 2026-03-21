import { useRouter } from "next/navigation";

function EmptyDocument() {
  const router = useRouter();

  return (
    <div className="border border-white/8 rounded-sm px-8 py-16 text-center">
      <div className="text-[48px] text-text/10 mb-4">▣</div>
      <h3 className="text-[18px] font-serif text-text/60 mb-2">
        No documents yet
      </h3>
      <p className="text-[13px] text-text/30 font-sans max-w-sm mx-auto mb-6">
        Upload your first document to start generating AI-powered summaries and
        insights.
      </p>
      <button
        type="button"
        onClick={() => router.replace("/dashboard/upload")}
        className="px-6 py-3 bg-primary text-background text-[12px] font-bold tracking-[0.12em] font-sans rounded-sm transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5 cursor-pointer"
      >
        UPLOAD DOCUMENT
      </button>
    </div>
  );
}

export default EmptyDocument;
