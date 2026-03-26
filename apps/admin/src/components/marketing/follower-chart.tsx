"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FollowerDataPoint {
  date: string;
  twitter: number;
  instagram: number;
  tiktok: number;
}

interface FollowerChartProps {
  data: FollowerDataPoint[];
}

function formatYAxis(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toString();
}

export function FollowerChart({ data }: FollowerChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="twitterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="instagramGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="tiktokGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={formatYAxis}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.205 0 0)",
            border: "1px solid oklch(1 0 0 / 10%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "oklch(0.985 0 0)", marginBottom: "4px" }}
          formatter={(v: number) => [v.toLocaleString(), ""]}
        />
        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
        <Area
          type="monotone"
          dataKey="twitter"
          stroke="#38bdf8"
          strokeWidth={2}
          fill="url(#twitterGrad)"
          name="Twitter/X"
        />
        <Area
          type="monotone"
          dataKey="instagram"
          stroke="#f472b6"
          strokeWidth={2}
          fill="url(#instagramGrad)"
          name="Instagram"
        />
        <Area
          type="monotone"
          dataKey="tiktok"
          stroke="#f87171"
          strokeWidth={2}
          fill="url(#tiktokGrad)"
          name="TikTok"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
