"use client";

import HeaderDropDown from "@/components/HeaderDropDown";
import useDashboard from "@/features/dashboard/useDashboard";
import useDropdown from "@/features/ui/useDropdown";
import { User } from "@/types/user";
import { calcPct } from "@/utils/usage";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface LearningSetHeaderProps {
  user: User | null | undefined;
}

function LearningSetHeader({ user }: LearningSetHeaderProps) {
  const router = useRouter();
  const options = useDropdown();

  const { dashboardOverview } = useDashboard(user?._id ?? "");
  const { data: overview } = dashboardOverview;

  const tokenPct = calcPct(overview?.tokensUsed, user?.tokenLimit);
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

        <div className="h-5 w-px bg-[#C9A227]/12" />

        <h1 className="text-lg font-bold tracking-wide font-serif truncate">
          DOCUMENT <span className="text-primary">STUDY</span>
        </h1>
      </div>

      {/* User Icon */}
      <div className="relative" ref={options.ref}>
        {/* Dropdown */}
        {options.isOpen && (
          <HeaderDropDown
            userId={user?._id ?? ""}
            email={user?.email ?? ""}
            plan={user?.plan ?? ""}
            tokensUsed={overview?.tokensUsed ?? 0}
            tokenLimit={user?.tokenLimit ?? 0}
            tokenPct={tokenPct}
            documentUsed={overview?.documentsUploaded ?? 0}
            documentLimit={user?.documentLimit ?? 0}
            documentPct={documentPct}
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

export default LearningSetHeader;
