import { useRouter } from "next/navigation";

function ChatNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[16px] text-text/70 font-serif mb-4">
          Document not found
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-primary text-background text-[12px] font-bold tracking-wider font-sans rounded-sm hover:bg-[#e0b530] transition-colors"
        >
          BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );
}

export default ChatNotFound;
