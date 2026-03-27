import { cn } from "@/lib/utils";
import { AgentAvatar, type AgentId, AGENTS } from "./AgentAvatar";

export type MessageRole = "user" | "agent";

export interface ChatMessageData {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date | string;
  agentId?: AgentId;
  modelBadge?: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
  className?: string;
}

function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === "user";
  const agentConfig = message.agentId ? AGENTS[message.agentId] : null;

  return (
    <div
      className={cn(
        "flex gap-2.5 px-4",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      {!isUser && agentConfig ? (
        <AgentAvatar agent={agentConfig} size="sm" className="mt-0.5 shrink-0" />
      ) : !isUser ? (
        // Fallback avatar for unknown agent
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm shrink-0 mt-0.5">
          🤖
        </div>
      ) : (
        // User avatar
        <div className="w-8 h-8 rounded-lg bg-primary/20 ring-1 ring-primary/30 flex items-center justify-center text-xs font-semibold text-primary shrink-0 mt-0.5">
          U
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[75%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Model badge / agent name row */}
        {!isUser && (
          <div className="flex items-center gap-2">
            {agentConfig && (
              <span className="text-[11px] font-medium text-foreground/70">
                {agentConfig.name}
              </span>
            )}
            {message.modelBadge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                {message.modelBadge}
              </span>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground/60 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
