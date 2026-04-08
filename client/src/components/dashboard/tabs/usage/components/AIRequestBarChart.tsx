import formattedAIRequests from "@/helpers/format-ai-requests";
import { Usage } from "@/types/usage";
import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

interface AIRequestChartProps {
  usage: Usage[];
}

function AIRequestBarChart({ usage }: AIRequestChartProps) {
  const aiRequestsData = formattedAIRequests(usage);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={aiRequestsData}>
        <defs>
          <linearGradient id="aiRequests" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c9a227" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#c9a227" stopOpacity={0.3} />
          </linearGradient>
        </defs>

        <XAxis dataKey="month" />
        <YAxis />

        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
          contentStyle={{
            backgroundColor: "#111111",
            border: "none",
            borderRadius: "8px",
            padding: "8px",
          }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#fff" }}
        />

        {/* Bars */}
        <Bar
          dataKey="aiRequests"
          fill="url(#aiRequests)"
          radius={[6, 6, 0, 0]}
          isAnimationActive
        />

        {/* Line */}
        <Line
          type="monotone"
          dataKey="totalMessages"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default memo(AIRequestBarChart);
