"use client";

import { useEffect, useRef, useState } from "react";
import HeaderDropDown from "./HeaderDropDown";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import useDropdown from "@/features/ui/useDropdown";

interface DashboardHeaderProps {
  userId: string;
  plan: string;
  email: string;
  nav: string;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalDocuments: number;
  totalSummaries: number;
  totalFolders: number;
  tokensUsed: number;
  tokenLimit: number;
  tokenPct: number;
  documentUsed: number;
  documentLimit: number;
  documentPct: number;
}

function DashboardHeader({
  userId,
  plan,
  email,
  nav,
  setSidebarOpen,
  totalDocuments,
  totalSummaries,
  totalFolders,
  tokensUsed,
  tokenLimit,
  tokenPct,
  documentUsed,
  documentLimit,
  documentPct,
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
            {nav === "summaries" && `${totalSummaries} AI-generated summaries`}
            {nav === "folders" && `${totalFolders} folders`}
            {nav === "usage" && "Token & document consumption"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Upload — desktop */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-sm
            text-[11px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors duration-200"
          onClick={() => router.push("/dashboard/upload")}
        >
          <Upload className="w-4 h-4" />
          UPLOAD
        </button>

        {/* Upload — mobile icon only */}
        <button
          className="sm:hidden p-2 bg-primary text-black rounded-sm hover:bg-[#e0b530] transition-colors"
          onClick={() => router.push("/dashboard/upload")}
          aria-label="Upload"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={options.ref}>
          {options.isOpen && (
            <HeaderDropDown
              userId={userId}
              email={email}
              plan={plan}
              tokensUsed={tokensUsed}
              tokenLimit={tokenLimit}
              tokenPct={tokenPct}
              documentUsed={documentUsed}
              documentLimit={documentLimit}
              documentPct={documentPct}
            />
          )}

          <div
            className="w-8 h-8 rounded-full cursor-pointer bg-primary/20 border border-primary/30
              flex items-center justify-center text-[11px] text-primary font-bold font-sans
              hover:bg-primary/30 transition-colors duration-150 select-none"
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
