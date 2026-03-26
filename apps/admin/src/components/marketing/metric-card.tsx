import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: "blue" | "amber" | "purple" | "emerald";
}

const colorMap = {
  blue: "bg-blue-500/10 text-blue-500",
  amber: "bg-amber-500/10 text-amber-500",
  purple: "bg-purple-500/10 text-purple-500",
  emerald: "bg-emerald-500/10 text-emerald-500",
};

export function MetricCard({
  label,
  value,
  change,
  icon,
  color,
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", colorMap[color])}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive ? "text-emerald-500" : "text-red-500"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </div>
    </div>
  );
}
