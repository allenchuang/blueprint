import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: "blue" | "amber" | "purple" | "emerald";
}

const colorMap = {
  blue: { bg: "rgba(10,132,255,0.12)", icon: "#0a84ff" },
  amber: { bg: "rgba(255,159,10,0.12)", icon: "#ff9f0a" },
  purple: { bg: "rgba(191,90,242,0.12)", icon: "#bf5af2" },
  emerald: { bg: "rgba(48,209,88,0.12)", icon: "#30d158" },
};

export function MetricCard({ label, value, change, icon, color }: MetricCardProps) {
  const isPositive = change >= 0;
  const c = colorMap[color];

  return (
    <div
      className="mac-card px-4 py-4 space-y-3"
      style={{ background: "#2c2c2e" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[12px]" style={{ color: "#8e8e93" }}>
          {label}
        </p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, color: c.icon }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p
          className="text-[26px] font-bold leading-none"
          style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp className="w-3 h-3" style={{ color: "#30d158" }} />
          ) : (
            <TrendingDown className="w-3 h-3" style={{ color: "#ff453a" }} />
          )}
          <span
            className="text-[11px] font-medium"
            style={{ color: isPositive ? "#30d158" : "#ff453a" }}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span className="text-[11px]" style={{ color: "#636366" }}>
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
}
