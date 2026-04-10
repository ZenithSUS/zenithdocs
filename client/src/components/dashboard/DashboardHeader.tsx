"use client";

import HeaderDropDown from "../HeaderDropDown";
import { useRouter } from "next/navigation";
import { Brain, Upload } from "lucide-react";
import useDropdown from "@/features/ui/useDropdown";

interface DashboardHeaderProps {
  plan: string;
  email: string;
  nav: string;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalDocuments: number;
  totalSummaries: number;
  totalFolders: number;
  documentUsed: number;
  documentLimit: number;
  documentPct: number;
  storageLimit: number;
  storageUsed: number;
  storagePct: number;
  messages: number;
  messagesPerDay: number;
  messagePct: number;
}

function DashboardHeader({
  plan,
  email,
  nav,
  setSidebarOpen,
  totalDocuments,
  totalSummaries,
  totalFolders,
  documentUsed,
  documentLimit,
  documentPct,
  storageLimit,
  storageUsed,
  storagePct,
  messages,
  messagesPerDay,
  messagePct,
}: DashboardHeaderProps) {
  const router = useRouter();
  const options = useDropdown();

  return (
    <header className="px-5 sm:px-8 py-4 border-b border-white/6 flex items-center justify-between bg-background/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-text/50 hover:text-text/80 text-xl transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <div>
          <h1 className="text-[18px] sm:text-[20px] font-normal font-serif tracking-[-0.01em] capitalize">
            {nav}
          </h1>
          <p className="text-[11px] text-text/30 font-sans tracking-[0.05em] hidden sm:block">
            {nav === "overview" && "Your workspace at a glance"}
            {nav === "documents" && `${totalDocuments} total documents`}
            {nav === "studies" && "Your learning sets"}
            {nav === "summaries" && `${totalSummaries} AI-generated summaries`}
            {nav === "folders" && `${totalFolders} folders`}
            {nav === "chats" && "Your chat history"}
            {nav === "usage" && "Document and Message Consumption"}
            {nav === "shared" && "All shared documents"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Document Learning Center — desktop */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-sm
            text-[11px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors duration-200 hover:text-white cursor-pointer"
          onClick={() => router.push("/dashboard/learning-sets")}
        >
          <Brain className="w-4 h-4" />
          STUDY
        </button>

        {/* Upload — desktop */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-sm
            text-[11px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors duration-200 hover:text-white cursor-pointer"
          onClick={() => router.push("/dashboard/upload")}
        >
          <Upload className="w-4 h-4" />
          UPLOAD
        </button>

        {/* Document Learning Center — mobile icon only */}
        <button
          className="sm:hidden p-2 bg-primary text-black rounded-sm hover:bg-[#e0b530] transition-colors active:scale-95 cursor-pointer"
          onClick={() => router.push("/dashboard/learning-sets")}
          aria-label="Document Learning Center"
        >
          <Brain className="w-4 h-4" />
        </button>

        {/* Upload — mobile icon only */}
        <button
          className="sm:hidden p-2 bg-primary text-black rounded-sm hover:bg-[#e0b530] transition-colors active:scale-95 cursor-pointer"
          onClick={() => router.push("/dashboard/upload")}
          aria-label="Upload"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={options.ref}>
          {options.isOpen && (
            <HeaderDropDown
              email={email}
              plan={plan}
              documentUsed={documentUsed}
              documentLimit={documentLimit}
              documentPct={documentPct}
              storageLimit={storageLimit}
              storageUsed={storageUsed}
              storagePct={storagePct}
              messages={messages}
              messagesPerDay={messagesPerDay}
              messagePct={messagePct}
            />
          )}

          <div
            className="w-8 h-8 rounded-full  bg-[#C9A227]/12 border-primary/30
              flex items-center justify-center text-[11px] text-primary font-bold font-sans
              border-2 border-[#C9A227]/30 cursor-pointer transition-colors duration-150 select-none"
            onClick={() => options.setIsOpen((prev) => !prev)}
          >
            {email.slice(0, 1).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
