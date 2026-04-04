import { FileX2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

function DocumentNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 flex items-center justify-center">
          <FileX2Icon size={50} />
        </div>
        <h2 className="text-xl font-normal mb-2">Document not found</h2>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-6 py-2.5 bg-primary text-background text-[12px] font-bold tracking-widest font-sans rounded-sm hover:bg-[#e0b530] transition-colors"
        >
          BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );
}

export default DocumentNotFound;
