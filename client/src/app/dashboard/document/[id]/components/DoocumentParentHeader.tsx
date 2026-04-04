import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentParentHeaderProps {
  documentId: string;
}

function DocumentParentHeader({ documentId }: DocumentParentHeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-45 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#F5F5F5]/60 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-2 text-sm tracking-widest font-sans"
          >
            <ArrowLeft size={14} />
            BACK
          </button>
          <div className="h-5 w-px bg-[#F5F5F5]/10" />
          <h1 className="text-lg font-bold tracking-[0.08em] font-serif">
            DOCUMENT <span className="text-[#C9A227]">VIEW</span>
          </h1>
        </div>

        <div className="flex flex-row items-center gap-2">
          <button
            onClick={() =>
              router.push(`/dashboard/summarize?doc=${documentId}`)
            }
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[#C9A227] text-[#111111] rounded-sm text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5"
          >
            <Sparkles size={13} />
            SUMMARIZE
          </button>
          <button
            onClick={() => router.push(`/dashboard/chat?doc=${documentId}`)}
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-accent text-[#FFFFFF] rounded-sm text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-accent hover:-translate-y-0.5"
          >
            <MessageCircle size={20} />
            CHAT
          </button>
        </div>
      </div>
    </header>
  );
}

export default DocumentParentHeader;
