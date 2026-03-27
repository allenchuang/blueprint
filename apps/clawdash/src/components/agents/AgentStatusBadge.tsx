import { cn } from "@/lib/utils";

export type AgentStatus = "active" | "idle" | "running";

interface AgentStatusBadgeProps {
  status: AgentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; dotClass: string; pillClass: string }
> = {
  active: {
    label: "Active",
    dotClass: "bg-emerald-500",
    pillClass:
      "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  },
  idle: {
    label: "Idle",
    dotClass: "bg-muted-foreground/40",
    pillClass:
      "bg-muted/60 text-muted-foreground ring-1 ring-border",
  },
  running: {
    label: "Running",
    dotClass: "bg-blue-500",
    pillClass:
      "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  },
};

export function AgentStatusBadge({ status, className }: AgentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
        config.pillClass,
        className
      )}
    >
      {/* Dot with animation */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {status === "active" && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.dotClass
            )}
          />
        )}
        {status === "running" && (
          <span
            className={cn(
              "animate-pulse absolute inline-flex h-full w-full rounded-full opacity-75",
              config.dotClass
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-1.5 w-1.5",
            config.dotClass
          )}
        />
      </span>
      {config.label}
    </span>
  );
}
