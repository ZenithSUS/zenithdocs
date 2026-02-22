import sizefmt from "@/helpers/size-format";
import { Usage } from "@/types/usage";

interface UsageCardProps {
  usage: Usage;
  currentMonth: string;
  maxUsage: number;
}

function UsageCard({ usage: u, currentMonth, maxUsage }: UsageCardProps) {
  return (
    <div key={u.month} className="flex items-center gap-3">
      <span className="text-[11px] text-text/30 font-sans w-8 shrink-0">
        {sizefmt.month(u.month)}
      </span>
      <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(u.tokensUsed / maxUsage) * 100}%`,
            background:
              u.month === currentMonth ? "#C9A227" : "rgba(201,162,39,0.35)",
          }}
        />
      </div>
      <span className="text-[11px] text-text/30 font-sans w-10 text-right shrink-0">
        {sizefmt.num(u.tokensUsed)}
      </span>
    </div>
  );
}

export default UsageCard;
