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

export interface EngagementDataPoint {
  date: string;
  twitter: number;
  instagram?: number;
  tiktok?: number;
  total?: number;
}

interface EngagementChartProps {
  data: EngagementDataPoint[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#636366" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#636366" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "#3a3a3c",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#f5f5f7",
          }}
          labelStyle={{ color: "#f5f5f7", marginBottom: "4px" }}
          formatter={(value: number) => [`${value}%`, ""]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "12px", color: "#8e8e93" }}
        />
        <Line
          type="monotone"
          dataKey="twitter"
          stroke="#0a84ff"
          strokeWidth={2}
          dot={false}
          name="Twitter/X"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
