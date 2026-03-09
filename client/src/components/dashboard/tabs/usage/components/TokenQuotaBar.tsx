import sizefmt from "@/helpers/size-format";

interface Props {
  tokenPct: number;
  tokenLimit: number;
  tokensUsed: number;
}

const TokenQuotaBar = ({ tokenPct, tokenLimit, tokensUsed }: Props) => (
  <div className="border border-white/8 rounded-sm px-5 sm:px-7 py-6">
    <div className="flex justify-between items-center mb-4">
      <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
        MONTHLY TOKEN QUOTA
      </span>
      <span className="text-[13px] font-sans text-text/60">
        {sizefmt.num(tokensUsed)} / {sizefmt.num(tokenLimit)}
      </span>
    </div>

    <div className="w-full h-3 bg-white/6 rounded-full overflow-hidden mb-3">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${tokenPct}%`,
          background:
            tokenPct > 80
              ? "linear-gradient(90deg,#C9A227,#ef4444)"
              : "linear-gradient(90deg,#C9A227,#e0b530)",
        }}
      />
    </div>

    <div className="flex justify-between text-[10px] text-text/25 font-sans">
      <span>0</span>
      <span>{sizefmt.num(tokenLimit / 4)}</span>
      <span>{sizefmt.num(tokenLimit / 2)}</span>
      <span>{sizefmt.num(tokenLimit)}</span>
    </div>
  </div>
);

export default TokenQuotaBar;
