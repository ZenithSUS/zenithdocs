import "@/app/globals.css";
import LogoutModal from "./dashboard/modals/LogoutModal";
import sizefmt from "@/helpers/size-format";

interface HeaderDropDownProps {
  userId: string;
  email: string;
  plan: string;
  tokensUsed: number;
  tokenLimit: number;
  tokenPct: number;
  documentUsed: number;
  documentLimit: number;
  documentPct: number;
}

function HeaderDropDown({
  userId,
  email,
  plan,
  tokensUsed,
  tokenLimit,
  tokenPct,
  documentUsed,
  documentLimit,
  documentPct,
}: HeaderDropDownProps) {
  const userTokensUsed = Math.min(tokenLimit, tokensUsed);

  return (
    <div className="absolute top-full right-0 mt-2 w-72 rounded-sm bg-background border border-white/6 flex flex-col gap-3 px-5 py-4">
      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full text-primary border border-primary flex items-center justify-center shrink-0">
          {email[0].toUpperCase()}
        </div>
        <div className="flex flex-col items-start gap-1 min-w-0">
          <p className="text-sm font-semibold truncate w-full">{email}</p>
          <p className="text-xs text-text/50">{plan.toUpperCase()} PLAN</p>
        </div>
      </div>

      <div className="border-t border-white/6" />

      {/* Token quota */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] tracking-[0.15em] text-primary font-sans">
            TOKENS USED
          </span>
          <span className="text-[11px] text-text/50 font-sans">
            {tokenPct}%
          </span>
        </div>
        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${tokenPct}%`,
              background: tokenPct > 80 ? "#ef4444" : "#C9A227",
            }}
          />
        </div>
        <div className="text-[11px] text-text/35 font-sans">
          {sizefmt.num(userTokensUsed)} / {sizefmt.num(tokenLimit)}
        </div>
      </div>

      {/* Document quota */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] tracking-[0.15em] text-primary font-sans">
            DOCUMENTS UPLOADED
          </span>
          <span className="text-[11px] text-text/50 font-sans">
            {documentPct}%
          </span>
        </div>
        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${documentPct}%`,
              background: "#C9A227",
            }}
          />
        </div>
        <div className="text-[11px] text-text/35 font-sans">
          {sizefmt.num(documentUsed)} / {sizefmt.num(documentLimit)}
        </div>
      </div>

      <div className="border-t border-white/6" />

      <LogoutModal userId={userId} />
    </div>
  );
}

export default HeaderDropDown;
