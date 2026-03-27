import { strategies } from "@/lib/strategies";
import { cn } from "@/lib/utils";
import {
  ArrowUpCircle,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  Zap,
} from "lucide-react";

function ImpactBadge({ impact }: { impact: "high" | "medium" | "low" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
        impact === "high" && "bg-emerald-500/10 text-emerald-500",
        impact === "medium" && "bg-amber-500/10 text-amber-500",
        impact === "low" && "bg-muted text-muted-foreground"
      )}
    >
      {impact === "high" && <Zap className="w-2.5 h-2.5" />}
      {impact.charAt(0).toUpperCase() + impact.slice(1)} impact
    </span>
  );
}

function EffortBadge({ effort }: { effort: "high" | "medium" | "low" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        effort === "high" && "bg-red-500/10 text-red-500",
        effort === "medium" && "bg-blue-500/10 text-blue-500",
        effort === "low" && "bg-emerald-500/10 text-emerald-500"
      )}
    >
      {effort.charAt(0).toUpperCase() + effort.slice(1)} effort
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#636366" }}>
      {status === "active" ? (
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#30d158" }} />
      ) : status === "completed" ? (
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#0a84ff" }} />
      ) : (
        <Circle className="w-3.5 h-3.5" />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PlatformTag({ platform }: { platform: string | undefined }) {
  if (!platform) return null;
  const labels: Record<string, string> = {
    twitter: "Twitter/X",
    instagram: "Instagram",
    tiktok: "TikTok",
    all: "All Platforms",
  };
  return (
    <span
      className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: "rgba(10,132,255,0.12)", color: "#5ac8fa" }}
    >
      {labels[platform] ?? platform}
    </span>
  );
}

const categoryLabels: Record<string, string> = {
  content: "Content",
  growth: "Growth",
  engagement: "Engagement",
  partnerships: "Partnerships",
  paid: "Paid",
};

function StrategyCard({ strategy: s }: { strategy: (typeof strategies)[0] }) {
  return (
    <div
      className="mac-card p-5 space-y-4"
      style={{ background: "#2c2c2e" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <ImpactBadge impact={s.impact} />
            <EffortBadge effort={s.effort} />
            <PlatformTag platform={s.platform} />
            <span
              className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={{ background: "rgba(255,255,255,0.08)", color: "#98989f" }}
            >
              {categoryLabels[s.category]}
            </span>
          </div>
          <h3
            className="text-[14px] font-semibold"
            style={{ color: "#f5f5f7", letterSpacing: "-0.01em" }}
          >
            {s.title}
          </h3>
          <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "#8e8e93" }}>
            {s.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={s.status} />
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#636366" }}>
            <Clock className="w-3.5 h-3.5" />
            {s.timeframe}
          </div>
        </div>
      </div>

      {/* Tactics */}
      <div
        className="space-y-1.5 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2"
          style={{ color: "#636366", letterSpacing: "0.08em" }}
        >
          Tactics
        </p>
        <ul className="space-y-1.5">
          {s.tactics.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px]">
              <ArrowUpCircle
                className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 rotate-90"
                style={{ color: "#0a84ff" }}
              />
              <span style={{ color: "#c7c7cc" }}>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function StrategiesPage() {
  const active = strategies.filter((s) => s.status === "active");
  const planned = strategies.filter((s) => s.status === "planned");

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1
          className="text-[22px] font-semibold"
          style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}
        >
          Growth Strategies
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: "#636366" }}>
          Blueprint OS marketing playbook — prioritized by impact
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active strategies", value: active.length, color: "#30d158" },
          { label: "Planned", value: planned.length, color: "#ff9f0a" },
          {
            label: "High impact",
            value: strategies.filter((s) => s.impact === "high").length,
            color: "#0a84ff",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="mac-card px-4 md:px-5 py-4"
            style={{ background: "#2c2c2e" }}
          >
            <p
              className="text-[24px] font-bold"
              style={{ color: stat.color, letterSpacing: "-0.02em" }}
            >
              {stat.value}
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: "#636366" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Active Strategies */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" style={{ color: "#30d158" }} />
          <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
            Active Strategies
          </span>
        </div>
        <div className="space-y-3">
          {active.map((s) => (
            <StrategyCard key={s.id} strategy={s} />
          ))}
        </div>
      </div>

      {/* Planned Strategies */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" style={{ color: "#636366" }} />
          <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
            Planned — Coming Up
          </span>
        </div>
        <div className="space-y-3">
          {planned.map((s) => (
            <StrategyCard key={s.id} strategy={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
