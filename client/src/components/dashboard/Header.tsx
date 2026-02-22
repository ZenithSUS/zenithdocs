"use client";

interface DashboardHeaderProps {
  email: string;
  nav: string;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalDocuments: number;
  totalSummaries: number;
  totalFolders: number;
}

function DashboardHeader({
  email,
  nav,
  setSidebarOpen,
  totalDocuments,
  totalSummaries,
  totalFolders,
}: DashboardHeaderProps) {
  return (
    <header className="px-5 sm:px-8 py-4 border-b border-white/6 flex items-center justify-between bg-background/90 backdrop-blur-sm sticky top-0 z-20">
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
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-sm text-[11px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors duration-200">
          <span>↑</span> UPLOAD
        </button>
        <button className="sm:hidden p-2 bg-primary text-background rounded-sm text-[14px] hover:bg-[#e0b530] transition-colors">
          ↑
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[11px] text-primary font-bold font-sans">
          {email.slice(0, 1).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
