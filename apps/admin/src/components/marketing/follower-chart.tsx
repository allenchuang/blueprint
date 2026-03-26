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
            <stop offset="5%" stopColor="#0a84ff" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0a84ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="instagramGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#bf5af2" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#bf5af2" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="tiktokGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff375f" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ff375f" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={formatYAxis}
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
          formatter={(v: number) => [v.toLocaleString(), ""]}
        />
        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px", color: "#8e8e93" }} />
        <Area type="monotone" dataKey="twitter" stroke="#0a84ff" strokeWidth={2} fill="url(#twitterGrad)" name="Twitter/X" />
        <Area type="monotone" dataKey="instagram" stroke="#bf5af2" strokeWidth={2} fill="url(#instagramGrad)" name="Instagram" />
        <Area type="monotone" dataKey="tiktok" stroke="#ff375f" strokeWidth={2} fill="url(#tiktokGrad)" name="TikTok" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
