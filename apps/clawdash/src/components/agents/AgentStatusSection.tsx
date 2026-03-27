import { cn } from "@/lib/utils";
import { AgentCard } from "./AgentCard";
import { type AgentId } from "./AgentAvatar";
import { type AgentStatus } from "./AgentStatusBadge";

export interface AgentStatusData {
  id: AgentId;
  status: AgentStatus;
  lastActive?: string;
  taskSummary?: string;
}

interface AgentStatusSectionProps {
  agents?: AgentStatusData[];
  onAgentClick?: (agentId: AgentId) => void;
  className?: string;
}

// Default static data — Ocean's API will replace this
const DEFAULT_AGENTS: AgentStatusData[] = [
  { id: "ash", status: "active", taskSummary: "Coordinating agent tasks and reviewing PRs" },
  { id: "ocean", status: "running", taskSummary: "Building agent control plane API" },
  { id: "skylar", status: "idle", lastActive: "2h ago" },
  { id: "coral", status: "running", taskSummary: "Designing ClawDash agent UI components" },
  { id: "arctic", status: "idle", lastActive: "5h ago" },
];

export function AgentStatusSection({
  agents = DEFAULT_AGENTS,
  onAgentClick,
  className,
}: AgentStatusSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-semibold tracking-tight">Agents</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Blueprint OS team — {agents.filter((a) => a.status !== "idle").length} active
          </p>
        </div>
      </div>

      {/* Horizontal scrollable row */}
      <div
        className={cn(
          "flex gap-3 overflow-x-auto pb-1",
          "-mx-1 px-1", // slight negative margin for edge glow visibility
          // Hide scrollbar but keep scroll functionality
          "[&::-webkit-scrollbar]:h-0"
        )}
      >
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent.id}
            status={agent.status}
            lastActive={agent.lastActive}
            taskSummary={agent.taskSummary}
            onClick={onAgentClick ? () => onAgentClick(agent.id) : undefined}
            className="shrink-0 w-[200px]"
          />
        ))}
      </div>
    </div>
  );
}
