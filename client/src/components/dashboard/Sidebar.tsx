import sizefmt from "@/helpers/size-format";

export type NavItem =
  | "overview"
  | "documents"
  | "summaries"
  | "folders"
  | "usage";

interface DashboardSidebarProps {
  nav: NavItem;
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tokenPct: number;
  processingDocs: number;
  tokensUsed: number;
  tokenLimit: number;
}

const navItems: { id: NavItem; icon: string; label: string }[] = [
  { id: "overview", icon: "◈", label: "Overview" },
  { id: "documents", icon: "▣", label: "Documents" },
  { id: "summaries", icon: "◎", label: "Summaries" },
  { id: "folders", icon: "⬡", label: "Folders" },
  { id: "usage", icon: "◉", label: "Usage" },
];

function DashBoardSidebar({
  nav,
  setNav,
  sidebarOpen,
  setSidebarOpen,
  tokenPct,
  processingDocs,
  tokensUsed,
  tokenLimit,
}: DashboardSidebarProps) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r border-white/6 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px] text-primary">◈</span>
          <span className="text-[15px] font-bold tracking-[0.08em] font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>
        <button
          className="lg:hidden text-text/40 hover:text-text/70 text-xl"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setNav(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all duration-200 font-sans text-[13px] tracking-[0.04em] ${
              nav === item.id
                ? "bg-primary/12 text-primary border border-primary/20"
                : "text-text/45 hover:text-text/80 hover:bg-white/4 border border-transparent"
            }`}
          >
            <span
              className={`text-[15px] ${nav === item.id ? "text-primary" : "text-text/30"}`}
            >
              {item.icon}
            </span>
            {item.label}
            {item.id === "documents" && processingDocs > 0 && (
              <span className="ml-auto text-[10px] bg-yellow-400/15 text-yellow-300 border border-yellow-400/20 px-1.5 py-0.5 rounded-full font-sans">
                {processingDocs}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Token quota widget */}
      <div className="mx-3 mb-4 px-4 py-4 border border-primary/15 rounded-sm bg-primary/4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] tracking-[0.15em] text-primary font-sans">
            TOKENS USED
          </span>
          <span className="text-[11px] text-text/50 font-sans">
            {tokenPct}%
          </span>
        </div>
        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${tokenPct}%`,
              background: tokenPct > 80 ? "#ef4444" : "#C9A227",
            }}
          />
        </div>
        <div className="text-[11px] text-text/35 font-sans">
          {sizefmt.num(tokensUsed)} / {sizefmt.num(tokenLimit)}
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[12px] text-primary font-bold font-sans">
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-sans text-text/80 truncate">
            archie@company.com
          </div>
          <div className="text-[10px] text-text/30 font-sans tracking-wider">
            FREE PLAN
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DashBoardSidebar;
