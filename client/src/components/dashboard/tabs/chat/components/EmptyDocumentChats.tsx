import { MessageSquare, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

function EmptyDocumentChats() {
  const router = useRouter();

  return (
    <div className="border border-white/8 rounded-lg px-8 py-16 text-center flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
        <MessageSquare className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-[24px] font-serif text-text/70 mb-3">
        No conversations yet
      </h3>
      <p className="text-[14px] text-text/40 font-sans max-w-md mx-auto leading-relaxed mb-8">
        Start chatting with your documents to see your conversations here.
        Upload a document and ask questions to get started.
      </p>
      <button
        onClick={() => router.push("/dashboard/upload")}
        className="px-6 py-3 bg-primary text-black text-[12px] font-bold tracking-wider font-sans rounded-sm hover:bg-[#e0b530] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
      >
        <Upload />
        UPLOAD DOCUMENT
      </button>
    </div>
  );
}

export default EmptyDocumentChats;
