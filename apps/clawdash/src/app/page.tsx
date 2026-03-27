"use client";

import { useSessions } from "@/hooks/use-sessions";
import { useSystemHealth } from "@/hooks/use-system-health";
import { useCosts } from "@/hooks/use-costs";
import { useAgentStatuses } from "@/hooks/use-agents";
import { formatBytes, formatNumber, formatCost } from "@/lib/utils";
import { AgentStatusCards } from "@/components/agents/agent-status-cards";
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  MessageSquare,
  Zap,
  DollarSign,
  Clock,
} from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {sub && (
          <p className="text-[12px] text-muted-foreground mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

function HealthGauge({
  label,
  value,
  max,
  unit,
  icon: Icon,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  icon: React.ElementType;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor =
    pct > 90
      ? "bg-destructive"
      : pct > 70
        ? "bg-warning"
        : "bg-primary";

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[13px] font-medium">{label}</span>
        <span className="ml-auto text-[13px] text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SessionsPreview({
  sessions,
}: {
  sessions: { id: string; model: string; status: string; updatedAt: string; messageCount: number }[];
}) {
  const recent = sessions.slice(0, 5);
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-[13px] font-semibold">Recent Sessions</span>
      </div>
      {recent.length === 0 ? (
        <div className="p-8 text-center text-[13px] text-muted-foreground">
          No sessions yet. Start an OpenClaw agent to see data here.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {recent.map((s) => (
            <div key={s.id} className="px-4 py-2.5 flex items-center gap-3">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  s.status === "active"
                    ? "bg-green-500 animate-pulse"
                    : s.status === "idle"
                      ? "bg-yellow-500"
                      : "bg-muted-foreground/30"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">
                  {s.id.slice(0, 12)}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {s.model}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[12px] text-muted-foreground">
                  {s.messageCount} msgs
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OverviewPage() {
  const { data: sessionsData } = useSessions();
  const { data: healthData } = useSystemHealth();
  const { data: costsData } = useCosts();

  const sessions = sessionsData?.sessions || [];
  const agentStatuses = useAgentStatuses(sessions);
  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalTokens = sessions.reduce(
    (sum, s) => sum + s.tokensIn + s.tokensOut,
    0
  );
  const totalMessages = sessions.reduce((sum, s) => sum + s.messageCount, 0);

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          OpenClaw agent diagnostics at a glance
        </p>
      </div>

      <AgentStatusCards agents={agentStatuses} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Active Sessions"
          value={String(activeSessions)}
          sub={`${sessions.length} total`}
          icon={Activity}
          color="#007AFF"
        />
        <StatCard
          label="Total Tokens"
          value={formatNumber(totalTokens)}
          sub={`${sessions.length} sessions`}
          icon={Zap}
          color="#30D158"
        />
        <StatCard
          label="Messages"
          value={formatNumber(totalMessages)}
          icon={MessageSquare}
          color="#AF52DE"
        />
        <StatCard
          label="Cost"
          value={formatCost(costsData?.totalCents || 0)}
          sub="all time"
          icon={DollarSign}
          color="#FF9F0A"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <HealthGauge
          label="CPU"
          value={healthData?.cpu.usage || 0}
          max={100}
          unit="%"
          icon={Cpu}
        />
        <HealthGauge
          label="Memory"
          value={healthData?.memory.usagePercent || 0}
          max={100}
          unit={`% · ${formatBytes(healthData?.memory.used || 0)}`}
          icon={MemoryStick}
        />
        <HealthGauge
          label="Disk"
          value={healthData?.disk[0]?.usePercent || 0}
          max={100}
          unit={`% · ${healthData?.disk[0]?.used || "—"} used`}
          icon={HardDrive}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SessionsPreview sessions={sessions} />
        <div className="rounded-xl border border-border bg-card">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[13px] font-semibold">System Info</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              {
                label: "Hostname",
                value: healthData?.hostname || "—",
                icon: Activity,
              },
              {
                label: "Platform",
                value: healthData?.platform || "—",
                icon: Cpu,
              },
              {
                label: "CPU",
                value: healthData?.cpu.model || "—",
                icon: Cpu,
              },
              {
                label: "Uptime",
                value: healthData
                  ? `${Math.floor(healthData.uptime / 3600)}h ${Math.floor((healthData.uptime % 3600) / 60)}m`
                  : "—",
                icon: Clock,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-[12px] text-muted-foreground w-20 shrink-0">
                  {item.label}
                </span>
                <span className="text-[13px] truncate">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
