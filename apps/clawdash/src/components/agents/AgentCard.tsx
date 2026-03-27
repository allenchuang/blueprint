import { cn } from "@/lib/utils";
import { AgentAvatar, type AgentId, type AgentConfig, AGENTS } from "./AgentAvatar";
import { AgentStatusBadge, type AgentStatus } from "./AgentStatusBadge";

interface AgentCardProps {
  agent: AgentId | AgentConfig;
  status?: AgentStatus;
  lastActive?: string;
  taskSummary?: string;
  onClick?: () => void;
  className?: string;
}

export function AgentCard({
  agent,
  status = "idle",
  lastActive,
  taskSummary,
  onClick,
  className,
}: AgentCardProps) {
  const config = typeof agent === "string" ? AGENTS[agent] : agent;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-4",
        "flex flex-col gap-3 min-w-[180px] select-none",
        "transition-all duration-200",
        onClick &&
          "cursor-pointer hover:border-border/80 hover:bg-card/80 active:scale-[0.98]",
        // Subtle top glow on hover matching agent color
        onClick && "hover:shadow-sm",
        className
      )}
    >
      {/* Gradient top accent line */}
      <div
        className={cn(
          "absolute top-0 left-4 right-4 h-px rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-60 transition-opacity duration-300",
          config.gradient
        )}
      />

      {/* Avatar + status row */}
      <div className="flex items-start justify-between gap-2">
        <AgentAvatar
          agent={config}
          size="lg"
          showGlow={status === "active" || status === "running"}
        />
        <AgentStatusBadge status={status} />
      </div>

      {/* Name + role */}
      <div className="space-y-0.5">
        <p className="text-[14px] font-semibold tracking-tight leading-none">
          {config.name}
        </p>
        <p className="text-[11px] text-muted-foreground leading-tight">
          {config.role}
        </p>
      </div>

      {/* Task or last active */}
      <div className="mt-auto">
        {taskSummary ? (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
            {taskSummary}
          </p>
        ) : lastActive ? (
          <p className="text-[11px] text-muted-foreground/60">
            Last active {lastActive}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground/40 italic">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
