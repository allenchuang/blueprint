import { strategies } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, Clock, Target, CheckCircle2, Circle, Zap } from "lucide-react";

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
    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      {status === "active" ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      ) : status === "completed" ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
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
    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
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

export default function StrategiesPage() {
  const active = strategies.filter((s) => s.status === "active");
  const planned = strategies.filter((s) => s.status === "planned");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Growth Strategies</h1>
        <p className="text-muted-foreground mt-1">
          Blueprint OS marketing playbook — prioritized by impact
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active strategies", value: active.length, color: "text-emerald-500" },
          { label: "Planned", value: planned.length, color: "text-amber-500" },
          { label: "High impact", value: strategies.filter(s => s.impact === "high").length, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card px-5 py-4">
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Strategies */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-foreground">Active Strategies</h2>
        </div>
        <div className="space-y-4">
          {active.map((s) => (
            <StrategyCard key={s.id} strategy={s} />
          ))}
        </div>
      </div>

      {/* Planned Strategies */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Planned — Coming Up</h2>
        </div>
        <div className="space-y-4">
          {planned.map((s) => (
            <StrategyCard key={s.id} strategy={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StrategyCard({ strategy: s }: { strategy: (typeof strategies)[0] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <ImpactBadge impact={s.impact} />
            <EffortBadge effort={s.effort} />
            <PlatformTag platform={s.platform} />
            <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-secondary-foreground">
              {categoryLabels[s.category]}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {s.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={s.status} />
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {s.timeframe}
          </div>
        </div>
      </div>

      {/* Tactics */}
      <div className="space-y-1.5 pt-1 border-t border-border">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tactics
        </p>
        <ul className="space-y-1">
          {s.tactics.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <ArrowUpCircle className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0 rotate-90" />
              <span className="text-foreground/80">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
