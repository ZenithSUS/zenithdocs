"use client";

import formatDailyMessages from "@/helpers/format-daily-messages";
import { Usage } from "@/types/usage";
import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyMessageChartProps {
  dailyMessages: Usage["dailyMessages"];
}

function DailyMessageLineChart({ dailyMessages }: DailyMessageChartProps) {
  const data = formatDailyMessages(dailyMessages);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis tickCount={4} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111111",
            border: "none",
            borderRadius: "8px",
            padding: "8px",
          }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#fff" }}
          labelFormatter={(label) => {
            const date = new Date(`${label} 1, 2000`);
            return date.toLocaleDateString("en-US", { month: "long" });
          }}
          labelClassName="text-primary font-bold"
          formatter={(value) => [`${value} sent`, "Sent"]}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#f59e0b"
          dot={{ fill: "#c9a227" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default memo(DailyMessageLineChart);
