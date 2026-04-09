"use client";

import formattedStorageTrend from "@/helpers/format-storage-trend";
import { Usage } from "@/types/usage";
import { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StorageUsageAreaChartProps {
  usage: Usage[];
}

function StorageUsageAreaChart({ usage }: StorageUsageAreaChartProps) {
  const storageTrendData = formattedStorageTrend(usage);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={storageTrendData}>
        <XAxis dataKey="month" />
        <YAxis />
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
          formatter={(value) => [`${value} MB`, "Storage Used"]}
        />

        <Area
          type="monotone"
          dataKey="storage"
          strokeWidth={2}
          stroke="#c9a227"
          fill="#f59e0b"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default memo(StorageUsageAreaChart);
