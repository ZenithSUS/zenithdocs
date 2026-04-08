"use client";

import formattedDocumentUploads from "@/helpers/format-document-uploads";
import { Usage } from "@/types/usage";
import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const COLORS = [
  "#c9a227", // parent color (golden yellow)
  "#e0b84a", // lighter tint
  "#a68f1b", // darker shade
  "#c97f27", // warm accent
  "#c9ca27", // yellow-green accent
  "#7f771b", // muted dark shade
];

const tooltipProps = {
  contentStyle: {
    backgroundColor: "#111111",
    border: "none",
    borderRadius: "8px",
    padding: "8px",
  },
  labelStyle: { color: "#fff" },
  itemStyle: { color: "#fff" },
};

interface Props {
  usage: Usage[];
  variant: "bar" | "donut";
}

function DocumentUploadUsageChart({ usage, variant }: Props) {
  const data = formattedDocumentUploads(usage);

  if (variant === "bar") {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 0, right: 20, top: 4, bottom: 4 }}
        >
          <XAxis
            type="number"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="month"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            {...tooltipProps}
          />
          <Bar
            dataKey="documentsUploaded"
            radius={[0, 6, 6, 0]}
            isAnimationActive
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="documentsUploaded"
            nameKey="month"
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={78}
            paddingAngle={3}
            isAnimationActive
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipProps} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="w-full flex flex-col gap-1.5">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-[11px] text-white/40">{entry.month}</span>
            </div>
            <span className="text-[11px] text-white/70 font-medium tabular-nums">
              {entry.documentsUploaded}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DocumentUploadUsageChart);
