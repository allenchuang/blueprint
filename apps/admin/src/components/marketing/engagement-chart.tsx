"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { EngagementDataPoint } from "@/lib/mock-data";

interface EngagementChartProps {
  data: EngagementDataPoint[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.205 0 0)",
            border: "1px solid oklch(1 0 0 / 10%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "oklch(0.985 0 0)", marginBottom: "4px" }}
          formatter={(value: number) => [`${value}%`, ""]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
        />
        <Line
          type="monotone"
          dataKey="twitter"
          stroke="#38bdf8"
          strokeWidth={2}
          dot={false}
          name="Twitter/X"
        />
        <Line
          type="monotone"
          dataKey="instagram"
          stroke="#f472b6"
          strokeWidth={2}
          dot={false}
          name="Instagram"
        />
        <Line
          type="monotone"
          dataKey="tiktok"
          stroke="#f87171"
          strokeWidth={2}
          dot={false}
          name="TikTok"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
