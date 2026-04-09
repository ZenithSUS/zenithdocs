"use client";

import HeaderDropDown from "@/components/HeaderDropDown";
import useDropdown from "@/features/ui/useDropdown";
import { useDashboardOverview } from "@/features/dashboard/useDashboardOverview";
import { User } from "@/types/user";
import { calcPct } from "@/utils/usage";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: User | null | undefined;
  title: string;
  titleHighlight: string;
}

function Header({ user, title, titleHighlight }: HeaderProps) {
  const router = useRouter();
  const options = useDropdown();

  const { data: overview } = useDashboardOverview(user?._id ?? "");

  const storageLimitMB = (user?.storageLimit ?? 0) * 1024 * 1024;
  const storagePct = calcPct(overview?.storageUsed ?? 0, storageLimitMB);
  const documentPct = calcPct(overview?.documentsUploaded, user?.documentLimit);

  return (
    <header className="fixed top-0 left-0 right-0 z-45 px-5 sm:-px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12 flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-text/50 hover:text-text/90 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] font-sans tracking-wider hidden sm:inline hover:text-yellow-400 cursor-pointer transition-colors duration-300 ease-in-out">
            BACK
          </span>
        </button>

        <div className="h-5 w-px bg-primary" />

        <h1 className="text-lg font-bold tracking-wide font-serif truncate uppercase">
          {title} <span className="text-primary">{titleHighlight}</span>
        </h1>
      </div>

      {/* User Icon */}
      <div className="relative" ref={options.ref}>
        {/* Dropdown */}
        {options.isOpen && (
          <HeaderDropDown
            email={user?.email ?? ""}
            plan={user?.plan ?? ""}
            documentUsed={overview?.documentsUploaded ?? 0}
            documentLimit={user?.documentLimit ?? 0}
            documentPct={documentPct}
            storageUsed={overview?.storageUsed ?? 0}
            storageLimit={user?.storageLimit ?? 0}
            storagePct={storagePct}
          />
        )}

        <div
          className="h-10 w-10 rounded-full bg-[#C9A227]/12 p-1 flex items-center justify-center border-2 border-[#C9A227]/30 cursor-pointer"
          onClick={() => options.setIsOpen((prev) => !prev)}
        >
          <span
            className="text-sm font-bold text-primary uppercase"
            style={{ lineHeight: 0 }}
          >
            {user?.email ? user.email.charAt(0) : "U"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
