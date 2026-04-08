"use client";

import sizefmt from "@/helpers/size-format";
import { User } from "@/types/user";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  ScrollText,
  Folder,
  MessageSquare,
  BarChart2,
  ArrowLeftRight,
  X,
  Diamond,
} from "lucide-react";

export type NavItem =
  | "overview"
  | "documents"
  | "studies"
  | "summaries"
  | "folders"
  | "chats"
  | "usage"
  | "shared";

interface DashboardSidebarProps {
  userLoading: boolean;
  user: User | null;
  nav: NavItem;
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  processingDocs: number;
  documentLimit: number;
  documentUsed: number;
  documentPct: number;
  storageLimit: number;
  storageUsed: number;
  storagePct: number;
  messages: number;
  messagesPerDay: number;
  messagePct: number;
}

const navItems: { id: NavItem; icon: React.ReactNode; label: string }[] = [
  { id: "overview", icon: <LayoutDashboard size={15} />, label: "Overview" },
  { id: "documents", icon: <FileText size={15} />, label: "Documents" },
  { id: "studies", icon: <BookOpen size={15} />, label: "Studies" },
  { id: "summaries", icon: <ScrollText size={15} />, label: "Summaries" },
  { id: "shared", icon: <ArrowLeftRight size={15} />, label: "Shared" },
  { id: "folders", icon: <Folder size={15} />, label: "Folders" },
  { id: "chats", icon: <MessageSquare size={15} />, label: "Chats" },
  { id: "usage", icon: <BarChart2 size={15} />, label: "Usage" },
];

function DashBoardSidebar({
  userLoading,
  user,
  nav,
  setNav,
  sidebarOpen,
  setSidebarOpen,
  processingDocs,
  documentLimit,
  documentUsed,
  documentPct,
  storageLimit,
  storageUsed,
  storagePct,
  messages,
  messagesPerDay,
  messagePct,
}: DashboardSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-white/6 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Logo & close button */}
      <div className="shrink-0 px-6 py-5 border-b border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Diamond size={20} className="text-primary" />
          <span className="text-[15px] font-bold tracking-[0.08em] font-serif">
            ZENITH<span className="text-primary">DOCS</span>
          </span>
        </div>
        <button
          className="lg:hidden text-text/40 hover:text-text/70"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto lg:overflow-y-hidden lg:hover:overflow-y-auto px-3 py-5 flex flex-col gap-1">
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
            <span className={nav === item.id ? "text-primary" : "text-text/30"}>
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

      {/* Bottom widgets + user */}
      <div className="shrink-0">
        {/* Usage summary */}
        <div className="mx-3 mb-4 px-4 py-3">
          <h2 className="mb-3 text-[10px] text-text/25 tracking-widest font-sans">
            USAGE
          </h2>

          <div className="flex flex-col gap-2.5 font-sans">
            {[
              {
                label: "Docs",
                value: documentUsed,
                limit: documentLimit,
                pct: documentPct,
                suffix: "",
              },
              {
                label: "Storage",
                value: sizefmt.num(Math.min(storageUsed, storageLimit)),
                limit: `${sizefmt.num(storageLimit)} MB`,
                pct: storagePct,
                suffix: "",
              },
              {
                label: "Messages",
                value: messages,
                limit: messagesPerDay,
                pct: messagePct,
                suffix: "",
              },
            ].map(({ label, value, limit, pct }) => (
              <div key={label}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[11px] text-text/35 tracking-wide">
                    {label}
                  </span>
                  <span className="text-[11px] text-primary">
                    {value} <span className="text-text">/ {limit}</span>
                  </span>
                </div>
                <div className="w-full h-0.5 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-0.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: pct >= 90 ? "#e05050" : "#C9A227",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[12px] text-primary font-bold font-sans">
            {user?.email ? user.email[0].toUpperCase() : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-sans text-text/80 truncate">
              {userLoading ? "Getting user info" : user?.email || "Anonymous"}
            </div>
            <div className="text-[10px] text-text/30 font-sans tracking-wider">
              {user?.plan ? user.plan.toUpperCase() + " PLAN" : "FREE PLAN"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DashBoardSidebar;
