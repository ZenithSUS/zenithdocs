import { Bot, File, MailCheckIcon } from "lucide-react";
import { memo } from "react";

interface Props {
  documentsThisMonth: number;
  totalMessagesThisMonth: number;
  totalAIRequests: number;
  nextMonthLabel: string;
}

const UsageSnapshot = ({
  documentsThisMonth,
  totalMessagesThisMonth,
  totalAIRequests,
  nextMonthLabel,
}: Props) => {
  const stats = [
    {
      label: "Documents This Month",
      value: documentsThisMonth ?? "...",
      icon: <File size={22} color="#c9a227" />,
      sub: `${documentsThisMonth} uploaded resets on ${nextMonthLabel}`,
    },
    {
      label: "Total Messages Sent This Month",
      value: totalMessagesThisMonth ?? "...",
      icon: <MailCheckIcon size={22} color="#c9a227" />,
      sub: `${totalMessagesThisMonth} sent`,
    },
    {
      label: "Total AI Requests This Month",
      value: totalAIRequests ?? "...",
      icon: <Bot size={22} color="#c9a227" />,
      sub: `${totalAIRequests} successful`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="px-6 py-5 border border-white/8 rounded-sm bg-white/2 hover:border-primary/20 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-3">{s.icon}</div>
          <div className="text-[28px] font-light text-text font-serif tracking-[-0.02em]">
            {s.value}
          </div>
          <div className="text-[10px] text-text/35 font-sans tracking-[0.06em] mt-0.5">
            {s.label.toUpperCase()}
          </div>
          <div className="text-[11px] text-text/20 font-sans mt-2">{s.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default memo(UsageSnapshot);
